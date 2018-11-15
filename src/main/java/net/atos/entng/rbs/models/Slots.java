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

    public boolean areNotStartingAndEndingSameDay() {
        boolean oneFound = false;
        for(Slot slot : this){
          if(slot.isNotStartingAndEndingSameDay()){ oneFound = true;}
        }
        return oneFound;
    }

    public Slot getSlotWithLatestEndDate(){
        Slot slot = this.get(0);
        if(this.size() > 1){
            for(int i =1 ; i< this.size(); i++){
                if(slot.getEnd().isBefore(this.get(i).getEnd())){
                    slot = this.get(i);
                }
            }
        }
        return slot;
    }

    public Slot getSlotWithFirstStartDate(){
        Slot slot = this.get(0);
        if(this.size() > 1){
            for(int i =1 ; i< this.size(); i++){
                if(slot.getStart().isAfter(this.get(i).getStart())){
                    slot = this.get(i);
                }
            }
        }
        return slot;
    }

}
