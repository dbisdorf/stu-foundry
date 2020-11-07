import { SaveTheUniverseSheet } from "./actor-sheet.js";

Hooks.once("init", async function() {
	console.log("Initializing Save the Universe System");

	Actors.unregisterSheet("core", ActorSheet);
	Actors.registerSheet("stu", SaveTheUniverseSheet, { makeDefault: true });
});

Hooks.on("createOwnedItem", (parentEntity, childData, options, userId) => {
    parentEntity.items.forEach(i => {
		if ((childData.type === i.data.type) && (i.data.name != childData.name)) {
			parentEntity.deleteOwnedItem(i.id);
		}
	});	
    parentEntity.update({
		"data.equipment": childData.data.equipment
	});	
	return true;
});