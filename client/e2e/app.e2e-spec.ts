import { SocoboPage } from "./app.po";

describe("socobo App", function() {
  let page: SocoboPage;

  beforeEach(() => {
    page = new SocoboPage();
  });

  it("should display message saying Socobo", () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual("Socobo");
  });
});
