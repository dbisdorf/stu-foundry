export class SaveTheUniverseSheet extends ActorSheet {

	/** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["stu", "sheet", "actor"],
      width: 750,
      height: 850,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "look" }]
    });
  }

	/** @override */
	get template() {
		const path = "systems/save-the-universe/templates";
		return `${path}/${this.actor.data.type}-sheet.html`;
	}

  /** @override */
  getData() {
    const data = super.getData();
    const actorData = data.actor;

    for (let i of data.items) {
      let item = i.data;
      if (i.type === 'role') {
        actorData.role = i;
      }
    }

    return data;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    html.find('.actions').on('click', this._onRollable.bind(this));
  }

  async _onRollable(event) {
    event.preventDefault();

    const target = event.currentTarget;
    const clickData = target.dataset;
    const actorData = this.actor.data.data;
    const roleData = this.getData().actor.role.data;

    let template = "systems/save-the-universe/templates/action-dialog.html";
    let preferredAndHealthy = {
      phrase: actorData.actions[clickData.action],
      preferred: roleData.actions[clickData.action],
      healthy: (actorData.health > 2)
    };
    const html = await renderTemplate(template, preferredAndHealthy);
    new Dialog({
      title: "Take Action",
      content: html,
      buttons: {
        submit: {
          label: "Roll",
          callback: dlg => this.rollAction(
            preferredAndHealthy, 
            $(dlg[0]).find("#expertise")[0].checked,
            $(dlg[0]).find("#help")[0].checked)
        }
      }
    }, {classes: ["stu", "dialog"]}).render(true);
  }

  async rollAction(preferredAndHealthy, expertise, help) {
    let explain = [];
    let die = new Die({faces: 6, number: 2}).evaluate();
    let passes = 0;
    for (let result of die.results) {
      let passFail = "FAIL";
      switch (result.result) {
        case 6:
          explain.push("Six: PASS");
          passes += 1;
          break;
        case 5:
          if (preferredAndHealthy.preferred) {
            passFail = "PASS";
            passes += 1;
          }
          explain.push("Five: " + passFail + " (preferred)");
          break;
        case 4:
          if (expertise) {
            passFail = "PASS";
            passes += 1;
          }
          explain.push("Four: " + passFail + " (expertise)");
          break;
        case 3:
          if (preferredAndHealthy.healthy) {
            passFail = "PASS";
            passes += 1;
          }
          explain.push("Three: " + passFail + " (health)");
          break;
        case 2:
          if (help) {
            passFail = "PASS";
            passes += 1;
          }
          explain.push("Two: " + passFail + " (help)");
          break;
        case 1:
          explain.push("One: FAIL");
          break;
      }
    }
    let finalResult = "";
    switch (passes) {
      case 0:
        finalResult = "Complete Failure";
        break;
      case 1:
        finalResult = "Mixed Result";
        break;
      case 2:
        finalResult = "Complete Success";
        break;
    }
    let template = 'systems/save-the-universe/templates/chat-roll.html';
    let templateData = {
      title: preferredAndHealthy.phrase,
      firstDie: explain[0],
      secondDie: explain[1],
      finalResult: finalResult
    };
    const content = await renderTemplate(template, templateData);
    let chatData = {
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: content,
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      sound: CONFIG.sounds.dice
    };
    console.debug(content.slice(0, 1));
    CONFIG.ChatMessage.entityClass.create(chatData, {});
  }

}
