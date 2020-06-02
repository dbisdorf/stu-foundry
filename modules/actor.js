export default class SaveTheUniverseActor extends Actor {

  /** @override */
  async createOwnedItem(itemData, options) {
    console.log("In my overridden createOwnedItem function");
    const data = this.data.data;
    data.equipment = itemData.data.equipment;
    return super.createOwnedItem(itemData, options);
  }

}
