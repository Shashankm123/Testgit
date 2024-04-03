import { LightningElement } from 'lwc';
export default class Hello extends LightningElement {
    greeting = 'Hello World';
    /*changeHandler(event) {
        this.greeting = event.target.value;
      }*/
      uppercaseItemName;
      get greeting() {
          return this.uppercaseItemName;
      }
      set greeting(value) {
          this.uppercaseItemName = value.toUpperCase();
      }
}