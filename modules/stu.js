import { SaveTheUniverseSheet } from "./actor-sheet.js";
import SaveTheUniverseActor from "./actor.js";

Hooks.once("init", async function() {
	console.log("Initializing Save the Universe System");

	CONFIG.Actor.entityClass = SaveTheUniverseActor;

	Actors.unregisterSheet("core", ActorSheet);
	Actors.registerSheet("stu", SaveTheUniverseSheet, { makeDefault: true });
});
