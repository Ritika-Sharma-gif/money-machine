import test from "node:test";
import assert from "node:assert/strict";
import { generateKeyPair, SignJWT, createLocalJWKSet, exportJWK } from "jose";
import { verifyToken, bearer } from "../api/_lib/auth.js";
import { route, HttpError } from "../api/_lib/http.js";
import {
  parseProfile, parseSettings, parseOnboarding, likePattern, isUuid, text, list,
} from "../api/_lib/validate.js";

const ISS = "https://auth.example.test";
const { publicKey, privateKey } = await generateKeyPair("EdDSA", { extractable: true });
const jwk = { ...(await exportJWK(publicKey)), kid: "k1", alg: "EdDSA" };
const keys = createLocalJWKSet({ keys: [jwk] });
const sign = (claims = {}, opts = {}) =>
  new SignJWT({ email: "a@b.test", name: "Ada", ...claims })
    .setProtectedHeader({ alg: "EdDSA", kid: "k1" })
    .setSubject(opts.sub ?? "11111111-1111-4111-8111-111111111111")
    .setIssuer(opts.iss ?? ISS)
    .setIssuedAt()
    .setExpirationTime(opts.exp ?? "10m")
    .sign(privateKey);
const rejects = (p) => assert.rejects(p, (e) => e instanceof HttpError && e.status === 401);

test("accepts a valid token", async () => {
  const p = await verifyToken(await sign(), keys, ISS);
  assert.equal(p.sub, "11111111-1111-4111-8111-111111111111");
});
test("rejects an expired token", async () => rejects(verifyToken(await sign({}, { exp: Math.floor(Date.now() / 1000) - 60 }), keys, ISS)));
test("rejects the wrong issuer", async () => rejects(verifyToken(await sign({}, { iss: "https://evil.test" }), keys, ISS)));
test("rejects a banned user", async () => rejects(verifyToken(await sign({ banned: true }), keys, ISS)));
test("rejects a token signed by another key", async () => {
  const other = await generateKeyPair("EdDSA");
  const forged = await new SignJWT({}).setProtectedHeader({ alg: "EdDSA", kid: "k1" })
    .setSubject("x").setIssuer(ISS).setExpirationTime("10m").sign(other.privateKey);
  await rejects(verifyToken(forged, keys, ISS));
});
test("rejects alg none and HS256 tokens", async () => {
  const none = `${Buffer.from('{"alg":"none"}').toString("base64url")}.${Buffer.from(`{"sub":"x","iss":"${ISS}"}`).toString("base64url")}.`;
  await rejects(verifyToken(none, keys, ISS));
  const hs = await new SignJWT({}).setProtectedHeader({ alg: "HS256" }).setSubject("x").setIssuer(ISS)
    .setExpirationTime("10m").sign(new TextEncoder().encode("secret-secret-secret-secret-secret!"));
  await rejects(verifyToken(hs, keys, ISS));
});
test("rejects a tampered token", async () => {
  const t = await sign();
  const [h, , s] = t.split(".");
  const body = Buffer.from(JSON.stringify({ sub: "99999999-9999-4999-8999-999999999999", iss: ISS })).toString("base64url");
  await rejects(verifyToken(`${h}.${body}.${s}`, keys, ISS));
});
test("bearer header parsing", () => {
  assert.equal(bearer({ headers: { authorization: "Bearer abc.def" } }), "abc.def");
  assert.throws(() => bearer({ headers: {} }), HttpError);
  assert.throws(() => bearer({ headers: { authorization: "Basic abc" } }), HttpError);
});

test("profile validation trims, limits and dedupes", () => {
  const p = parseProfile({ headline: "  Hi  ", categories: ["a", "a", " b "], discoverable: true });
  assert.equal(p.headline, "Hi");
  assert.deepEqual(p.categories, ["a", "b"]);
  assert.equal(p.bio, undefined);
  assert.throws(() => parseProfile({ headline: "x".repeat(141) }), HttpError);
  assert.throws(() => parseProfile({ discoverable: "yes" }), HttpError);
  assert.throws(() => parseProfile({ categories: "nope" }), HttpError);
  assert.throws(() => parseProfile({ categories: Array(13).fill("a").map((x, i) => x + i) }), HttpError);
});
test("settings and onboarding validation", () => {
  assert.deepEqual(parseSettings({ notifyOffers: false }), { notifyOffers: false, notifyMessages: undefined, notifyReminders: undefined });
  assert.throws(() => parseSettings({ notifyOffers: 1 }), HttpError);
  assert.equal(parseOnboarding({ accountType: "agency", organisationName: " Studio " }).organisationName, "Studio");
  assert.throws(() => parseOnboarding({ accountType: "admin" }), HttpError);
  assert.throws(() => parseOnboarding({ displayName: "  " }), HttpError);
});
test("accountType cannot grant staff and unknown keys are ignored", () => {
  const p = parseOnboarding({ accountType: "creator", isStaff: true, is_staff: true });
  assert.deepEqual(Object.keys(p).sort(), ["accountType", "displayName", "organisationName"]);
});
test("search text is matched literally", () => {
  assert.equal(likePattern("50%_off\\"), "%50\\%\\_off\\\\%");
  assert.equal(likePattern(""), "%%");
});
test("uuid and text helpers", () => {
  assert.ok(isUuid("11111111-1111-4111-8111-111111111111"));
  assert.ok(!isUuid("1; drop table app_user"));
  assert.ok(!isUuid(undefined));
  assert.equal(text("a\u0000b", 5, "x"), "ab");
  assert.equal(list(undefined, 2, 2, "x"), undefined);
});

function fakeRes() {
  return { headers: {}, setHeader(k, v) { this.headers[k] = v; }, end(b) { this.body = b; } };
}
test("route: 405, error mapping, no leaks, no-store", async () => {
  const h = route({
    GET: async () => ({ ok: 1 }),
    POST: async () => { throw new HttpError(400, "bad"); },
    PUT: async () => { throw new Error("db password is hunter2"); },
  });
  let r = fakeRes(); await h({ method: "GET" }, r);
  assert.equal(r.statusCode, 200); assert.equal(r.headers["Cache-Control"], "no-store");
  r = fakeRes(); await h({ method: "DELETE" }, r);
  assert.equal(r.statusCode, 405); assert.equal(r.headers.Allow, "GET, POST, PUT");
  r = fakeRes(); await h({ method: "POST" }, r);
  assert.equal(r.statusCode, 400); assert.deepEqual(JSON.parse(r.body), { error: "bad" });
  const quiet = console.error; console.error = () => {};
  r = fakeRes(); await h({ method: "PUT" }, r); console.error = quiet;
  assert.equal(r.statusCode, 500); assert.ok(!r.body.includes("hunter2"));
});
