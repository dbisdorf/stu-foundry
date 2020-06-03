export default class SaveTheUniverseActor extends Actor {

  /** @override */
  async createOwnedItem(itemData, options) {
    this.update({
      "data.equipment": itemData.data.equipment
    });
    return super.createOwnedItem(itemData, options);
  }

}
