jest.mock("react-native-mmkv", () => {
  class MockMMKV {
    store = new Map<string, string>();
    getString(key: string) {
      return this.store.get(key);
    }
    set(key: string, value: string) {
      this.store.set(key, value);
    }
    remove(key: string) {
      this.store.delete(key);
    }
    clearAll() {
      this.store.clear();
    }
  }
  return { createMMKV: () => new MockMMKV() };
});
