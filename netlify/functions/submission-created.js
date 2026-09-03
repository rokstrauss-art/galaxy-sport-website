// netlify/functions/submission-created.js
// Netlify to funkcijo POŽENE SAMODEJNO ob vsaki oddaji obrazca (ime je rezervirano).
// Naredi dvoje:
//   1. pošlje potrditev prijavljenemu
//   2. pošlje obvestilo Marku
//
// Env: RESEND_API_KEY   (resend.com, brezplačno do 3.000 mailov na mesec)
//      MAIL_MARKO       (naslov, kamor pridejo obvestila o novih prijavah)
//      MAIL_OD          (neobvezno; privzeto "Galaxy Sport <info@galaxysport.si>")
//      MAIL_ODGOVOR     (neobvezno; kam gredo odgovori, privzeto info@galaxysport.si)
//
// Da pošta res odide z naslova @galaxysport.si, mora biti domena potrjena
// v Resend (SPF in DKIM zapisa v DNS). Glej NAVODILA.md.

exports.handler = async (event) => {
  let payload = {};
  try { payload = JSON.parse(event.body || "{}").payload || {}; } catch (e) { /* ignore */ }

  const f = payload.data || {};
  if ((payload.form_name || "") !== "event-registration") {
    return { statusCode: 200, body: "ni prijava na dogodek" };
  }

  const ime = (f.name || "").trim();
  const email = (f.email || "").trim();
  const tel = (f.phone || "").trim();
  const dogodek = (f.event_title || "").trim();
  const datum = (f.event_date || "").trim();
  const cena = (f.event_price || "").trim();
  const oseb = (f.people_count || "1").trim();
  const placilo = (f.payment_method || "").trim();
  const opombe = (f.notes || "").trim();
  const izkusnje = (f.experience || "").trim();

  const OD = process.env.MAIL_OD || "Galaxy Sport <info@galaxysport.si>";
  const ODGOVOR = process.env.MAIL_ODGOVOR || "info@galaxysport.si";

  if (!process.env.RESEND_API_KEY) {
    console.error("PRIJAVA: RESEND_API_KEY ni nastavljen, mail ni poslan");
    return { statusCode: 200, body: "mail ni nastavljen" };
  }

  async function poslji(za, zadeva, html, odgovorNa) {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: OD,
        to: [za],
        reply_to: odgovorNa || ODGOVOR,
        subject: zadeva,
        html,
      }),
    });
    if (!r.ok) console.error("RESEND:", za, r.status, (await r.text()).slice(0, 200));
    return r.ok;
  }

  const brezplacno = /brezpla/i.test(cena) || cena === "0 €";
  const placiloBesedilo = brezplacno
    ? "Udeležba je brezplačna."
    : (placilo.includes("TRR")
        ? "Podatke za nakazilo ti pošljemo v ločenem sporočilu v največ 24 urah. Mesto je rezervirano po prejemu plačila."
        : "Če plačilo s kartico še ni bilo izvedeno, ti pošljemo povezavo v ločenem sporočilu.");

  // ── 1) potrditev prijavljenemu ──
  const zaPrijavljenega = `
  <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;color:#1A1A16;line-height:1.6">
    <div style="background:#1A2E26;color:#F4EFE6;padding:26px 28px;border-radius:14px 14px 0 0">
      <div style="font-size:12px;letter-spacing:.1em;text-transform:uppercase;opacity:.7">Galaxy Sport</div>
      <div style="font-size:22px;font-weight:700;margin-top:4px">Prijava je sprejeta</div>
    </div>
    <div style="background:#fff;border:1px solid #DDD6C7;border-top:0;padding:26px 28px;border-radius:0 0 14px 14px">
      <p>Živjo ${ime || ""},</p>
      <p>hvala za prijavo. Tvoje mesto je zabeleženo.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px">
        <tr><td style="padding:7px 0;color:#8A8578;width:120px">Dogodek</td><td style="padding:7px 0;font-weight:600">${dogodek}</td></tr>
        ${datum ? `<tr><td style="padding:7px 0;color:#8A8578">Datum</td><td style="padding:7px 0">${datum}</td></tr>` : ""}
        <tr><td style="padding:7px 0;color:#8A8578">Število oseb</td><td style="padding:7px 0">${oseb}</td></tr>
        ${cena ? `<tr><td style="padding:7px 0;color:#8A8578">Cena</td><td style="padding:7px 0">${cena}</td></tr>` : ""}
      </table>
      <p style="background:#F4EFE6;padding:12px 14px;border-radius:10px;font-size:14px">${placiloBesedilo}</p>
      <p style="font-size:14px">Če imaš vprašanje ali se ti kaj spremeni, piši na ta naslov ali pokliči <b>070 678 401</b>.</p>
      <p style="margin-top:20px">Se vidimo,<br><b>Marko, Galaxy Sport</b><br>
      <span style="color:#8A8578;font-size:13px">Šujica 150a, Dobrova · galaxysport.si</span></p>
    </div>
  </div>`;

  // ── 2) obvestilo Marku ──
  const zaMarka = `
  <div style="font-family:system-ui,sans-serif;max-width:560px;color:#1A1A16;line-height:1.6">
    <h2 style="margin:0 0 12px;font-size:18px">Nova prijava: ${dogodek}</h2>
    <table style="border-collapse:collapse;font-size:14px">
      <tr><td style="padding:5px 14px 5px 0;color:#8A8578">Ime</td><td style="padding:5px 0;font-weight:600">${ime}</td></tr>
      <tr><td style="padding:5px 14px 5px 0;color:#8A8578">E-pošta</td><td style="padding:5px 0"><a href="mailto:${email}">${email}</a></td></tr>
      <tr><td style="padding:5px 14px 5px 0;color:#8A8578">Telefon</td><td style="padding:5px 0"><a href="tel:${tel}">${tel}</a></td></tr>
      <tr><td style="padding:5px 14px 5px 0;color:#8A8578">Oseb</td><td style="padding:5px 0">${oseb}</td></tr>
      <tr><td style="padding:5px 14px 5px 0;color:#8A8578">Plačilo</td><td style="padding:5px 0">${placilo || "ni izbrano"}</td></tr>
      ${izkusnje ? `<tr><td style="padding:5px 14px 5px 0;color:#8A8578">Izkušnje</td><td style="padding:5px 0">${izkusnje}</td></tr>` : ""}
      ${opombe ? `<tr><td style="padding:5px 14px 5px 0;color:#8A8578">Opombe</td><td style="padding:5px 0">${opombe}</td></tr>` : ""}
    </table>
    <p style="margin-top:14px;font-size:13px;color:#8A8578">Prijavljeni je prejel samodejno potrditev. Vse prijave so tudi na pregledu in v Netlify pod Forms.</p>
  </div>`;

  const r1 = email ? await poslji(email, `Prijava sprejeta: ${dogodek}`, zaPrijavljenega) : false;
  // pri obvestilu Marku je reply-to stranka, da lahko odgovori naravnost njej
  const r2 = process.env.MAIL_MARKO
    ? await poslji(process.env.MAIL_MARKO, `Nova prijava: ${dogodek} (${ime})`, zaMarka, email || undefined)
    : false;

  return { statusCode: 200, body: JSON.stringify({ potrditev: r1, obvestilo: r2 }) };
};
