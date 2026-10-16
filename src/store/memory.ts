export interface LinkRecord {
  code: string; url: string; clicks: number; createdAt: Date;
}
export interface LinkStore {
  create(url: string, code: string): LinkRecord;      // simpan baru
  find(code: string): LinkRecord | undefined;
  recordHit(code: string): void;                      // clicks +1
}

// W3 nanti: buat createPostgresStore() dengan SIGNATURE YANG SAMA,
// routes tidak perlu berubah sama sekali. Itu gunanya interface ini.
export function createMemoryStore(): LinkStore {
  const links = new Map<string, LinkRecord>();

  return {
    create(url, code) {
      const record: LinkRecord = { code, url, clicks: 0, createdAt: new Date() };
      links.set(code, record);
      return record;
    },
    find(code) {
      return links.get(code);
    },
    recordHit(code) {
      const record = links.get(code);
      if (record) record.clicks += 1;
    },
  };
}
