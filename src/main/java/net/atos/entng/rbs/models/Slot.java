package net.atos.entng.rbs.models;

import io.vertx.core.json.JsonObject;

import java.time.ZonedDateTime;
import java.util.Iterator;

public class Slot {

	private final ZonedDateTime start;
	private final ZonedDateTime end;


	public Slot(ZonedDateTime start, ZonedDateTime end, String iana) {
		super();
		this.start = start;
		this.end = end;
	}

	public Slot(Long start,Long end, String iana){
		super();

		this.start = BookingDateUtils.localDateTimeForTimestampSecondsAndIana(start, iana );
		this.end = BookingDateUtils.localDateTimeForTimestampSecondsAndIana(end, iana );
	}
	public Slot(JsonObject json){
		this(json.getLong("start_date", 0l), json.getLong("end_date", 0l), json.getString("iana"));
	}

	public long getStartUTC() {
		return this.start.toEpochSecond();
	}

	public long getEndUTC() {
		return this.end.toEpochSecond();
	}

	public int getSelectedDay() {
		return start.getDayOfWeek().getValue() % 7;
	}

	public static class SlotIterable implements Iterable<Slot> {
		private final Booking booking;
		int nbDaysFromBeginning = 0;

		public SlotIterable(Booking booking) {
			this.booking = booking;
		}

		public int getNbDaysFromBeginning() {
			return nbDaysFromBeginning;
		}

		@Override
		public Iterator<Slot> iterator() {
			nbDaysFromBeginning = 0;// reset
			return new SlotIterator();
		}

		private class SlotIterator implements Iterator<Slot> {
			int index = 1;
			int selectedDay = -1;
			int nbOccurences = -1;
			ZonedDateTime baseStart;
			ZonedDateTime baseEnd;

			public SlotIterator() {
				selectedDay = booking.dayOfWeekForStartDate();
				nbOccurences = booking.getOccurrences(-1);
				baseStart = BookingDateUtils.localDateTimeForTimestampSecondsAndIana(booking.getStartDateAsUTCSeconds(),
						booking.getIana());
				baseEnd = BookingDateUtils.localDateTimeForTimestampSecondsAndIana(booking.getEndDateAsUTCSeconds(),
						booking.getIana());
				if (nbOccurences == -1) {
					nbOccurences = booking.countOccurrences();
				}
			}

			@Override
			public boolean hasNext() {
				return nbOccurences > 1 && index <= (nbOccurences - 1);
			}

			@Override
			public Slot next() {
				int nbDays = booking.getNextIntervalAsDayOfWeek(selectedDay);
				nbDaysFromBeginning += nbDays;
				selectedDay = BookingDateUtils.nextDayOfWeek(selectedDay, nbDays);
				Slot slot = new Slot(BookingDateUtils.addDaysIgnoreDST(baseStart, nbDaysFromBeginning),
						BookingDateUtils.addDaysIgnoreDST(baseEnd, nbDaysFromBeginning),booking.getIana());
				index++;
				return slot;
			}

		}
	}
	public boolean isNotStartingAndEndingSameDay() {
		final long startDay = dayOfWeekForStartDate();
		final long endDay = dayOfWeekForEndDate();
		return startDay != endDay;
	}

	public int dayOfWeekForStartDate() {
		return getStart().getDayOfWeek().getValue() % 7;
	}


	public int dayOfWeekForEndDate() {
		return getEnd().getDayOfWeek().getValue() % 7;
	}
	public ZonedDateTime getStart() {
		return start;
	}
	public ZonedDateTime getEnd() { return end;	}
}
