export class SaveTheUniverseActor extends Actor {

  /** @override */
  async createEmbeddedEntity(embeddedName, itemData, options) {
    console.log("Here I am in createEmbeddedEntity");
    console.log(itemData.data);
    this.update({
      "data.equipment": itemData.data.equipment
    });
    return super.createEmbeddedEntity(embeddedName, itemData, options);
  }

}
