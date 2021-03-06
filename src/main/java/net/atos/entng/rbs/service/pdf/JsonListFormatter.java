package net.atos.entng.rbs.service.pdf;

import net.atos.entng.rbs.model.ExportBooking;
import org.joda.time.DateTime;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;

public class JsonListFormatter extends JsonFormatter {

    private class Booking {
        private String ownerName;
        private DateTime startDate;
        private DateTime endDate;

        private Booking(String ownerName, String startDate, String endDate) {
            this.ownerName = ownerName;
            this.startDate = new DateTime(startDate);
            this.endDate= new DateTime(endDate);
        }

        private String getOwnerName() {
            return ownerName;
        }

        private DateTime getStartDate() {
            return startDate;
        }

        private DateTime getEndDate() {
            return endDate;
        }
    }

    private class BookingComparator implements Comparator<Booking> {

        @Override
        public int compare(Booking booking, Booking t1) {
            return booking.getStartDate().compareTo(t1.getStartDate());
        }
    }

	private final int CALENDAR_WIDTH = 680;
    private final int NUMBER_OF_BOOKINGS_BY_PAGE = 25;

	public JsonListFormatter(JsonObject jsonFileObject) {
        super(jsonFileObject);
	}

	public JsonObject format(){

        JsonObject convertedObject = new JsonObject();
        convertedObject.put(EDITION_DATE_FIELD_NAME, DateTime.now().toString("dd/MM/YYYY"));

        // General calendar settings
        convertedObject.put(CALENDAR_WIDTH_FIELD_NAME, CALENDAR_WIDTH);
        convertedObject.put(CALENDAR_WIDTH_UNIT_FIELD_NAME, DEFAULT_SIZE_UNIT);
        JsonArray exportBookingList = exportObject.getJsonArray(BOOKING_LIST_FIELD_NAME);

        // Building resource list
        ArrayList<Long> performedResourceId = new ArrayList<Long>();
        JsonArray resourceList = new fr.wseduc.webutils.collections.JsonArray();

        for (int i = 0; i < exportBookingList.size(); i++) {
            JsonObject bookingIterator = exportBookingList.getJsonObject(i);
            Long currentResourceId = bookingIterator.getLong(ExportBooking.RESOURCE_ID);

            if(!performedResourceId.contains(currentResourceId)){ // New resource found
                performedResourceId.add(bookingIterator.getLong(ExportBooking.RESOURCE_ID));

                // Adding resource bookings
                ArrayList<Booking> bookingList = new ArrayList<>();
                for (int j = 0; j < exportBookingList.size(); j++) {
                    JsonObject exportBooking = exportBookingList.getJsonObject(j);

                    if(exportBooking.getLong(ExportBooking.RESOURCE_ID).equals(currentResourceId)){ // This booking belongs to the current resource


                        String ownerName = exportBooking.getString(ExportBooking.BOOKING_OWNER_NAME);
                        String startDate = exportBooking.getString(ExportBooking.BOOKING_START_DATE);
                        String endDate = exportBooking.getString(ExportBooking.BOOKING_END_DATE);

                        bookingList.add(new Booking(ownerName, startDate, endDate));
                    }
                }

                // Sort bookings by start date
                Collections.sort(bookingList, new BookingComparator());

                int cpt = 0;
                JsonArray jsonBookingList = new fr.wseduc.webutils.collections.JsonArray();
                for (Booking b: bookingList) {
                    JsonObject jsonBooking = new JsonObject();

                    jsonBooking.put(ExportBooking.BOOKING_OWNER_NAME, b.getOwnerName());
                    jsonBooking.put(ExportBooking.BOOKING_START_DATE, b.getStartDate().toString("dd/MM/YYYY à kk:mm").replace(':', 'h'));
                    jsonBooking.put(ExportBooking.BOOKING_END_DATE, b.getEndDate().toString("dd/MM/YYYY à kk:mm").replace(':', 'h'));

                    jsonBookingList.add(jsonBooking);
                    cpt++;

                    if(cpt % NUMBER_OF_BOOKINGS_BY_PAGE == 0) {
                        JsonObject resource = buildResource(currentResourceId,
                                bookingIterator.getString(ExportBooking.RESOURCE_NAME),
                                bookingIterator.getString(ExportBooking.RESOURCE_COLOR),
                                bookingIterator.getString(ExportBooking.SCHOOL_NAME),
                                jsonBookingList);

                        resourceList.add(resource);
                        jsonBookingList = new fr.wseduc.webutils.collections.JsonArray();
                    }
                }

                if(cpt % NUMBER_OF_BOOKINGS_BY_PAGE != 0) {
                    JsonObject resource = buildResource(currentResourceId,
                            bookingIterator.getString(ExportBooking.RESOURCE_NAME),
                            bookingIterator.getString(ExportBooking.RESOURCE_COLOR),
                            bookingIterator.getString(ExportBooking.SCHOOL_NAME),
                            jsonBookingList);

                    resourceList.add(resource);
                }
            }
        }

        convertedObject.put(RESOURCES_FIELD_NAME, resourceList);

        return convertedObject;
	}

	private JsonObject buildResource(Long id, String name, String color, String schoolName, JsonArray bookingList) {
        JsonObject resource = new JsonObject();
        resource.put(ExportBooking.RESOURCE_ID, id);
        resource.put(ExportBooking.RESOURCE_NAME, name);
        resource.put(ExportBooking.RESOURCE_COLOR, color);
        resource.put(ExportBooking.SCHOOL_NAME, schoolName);
        resource.put(BOOKING_LIST_FIELD_NAME, bookingList);

        return resource;
    }
}
