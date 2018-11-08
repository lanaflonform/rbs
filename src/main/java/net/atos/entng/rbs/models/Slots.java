package net.atos.entng.rbs.models;

import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

import java.util.ArrayList;

public class Slots extends ArrayList<Slot> {

    public Slots() {
        super();
    }

    public Slots(JsonArray slots) {
        slots.forEach(stringSlot -> {
            Slot slot = new Slot(new JsonObject(stringSlot.toString()));
            this.add(slot);
        });
    }

    public boolean slotsAreNotStartingAndEndingSameDay () {
        boolean oneFound = false;
        for(Slot slot : this){
          if(slot.isNotStartingAndEndingSameDay()){ oneFound = true;}
        }
        return oneFound;
    }

}
