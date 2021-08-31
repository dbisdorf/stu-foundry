import { SaveTheUniverseSheet } from "./actor-sheet.js";

Hooks.once("init", async function() {
	console.log("Initializing Save the Universe System");

	Actors.unregisterSheet("core", ActorSheet);
	Actors.registerSheet("stu", SaveTheUniverseSheet, { makeDefault: true });
});

Hooks.on("createItem", (document, options, userId) => {
	document.actor.data.items.forEach(i => {
		if ((document.data.type === i.data.type) && (i.data.name != document.data.name)) {
			document.actor.deleteEmbeddedDocuments("Item", [i.id]);
		}
	});

	document.actor.update({
		"data.equipment": document.data.data.equipment
	});
});

