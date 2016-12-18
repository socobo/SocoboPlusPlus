import { browser, element, by } from "protractor";

export class SocoboPage {
  navigateTo() {
    return browser.get("/");
  }

  getParagraphText() {
    return element(by.css("scb-root h1")).getText();
  }
}
