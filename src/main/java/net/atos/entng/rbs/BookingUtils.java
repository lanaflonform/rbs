/*
 * Copyright © Région Nord Pas de Calais-Picardie,  Département 91, Région Aquitaine-Limousin-Poitou-Charentes, 2016.
 *
 * This file is part of OPEN ENT NG. OPEN ENT NG is a versatile ENT Project based on the JVM and ENT Core Project.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation (version 3 of the License).
 *
 * For the sake of explanation, any module that communicate over native
 * Web protocols, such as HTTP, with OPEN ENT NG is outside the scope of this
 * license and could be license under its own terms. This is merely considered
 * normal use of OPEN ENT NG, and does not fall under the heading of "covered work".
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 */

package net.atos.entng.rbs;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import net.atos.entng.rbs.service.BookingServiceSqlImpl;
import org.entcore.common.user.DefaultFunctions;
import org.entcore.common.user.UserInfos;
import org.entcore.common.user.UserInfos.Function;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.TimeUnit;

public class BookingUtils {
	private final static String DATE_FORMAT = BookingServiceSqlImpl.DATE_FORMAT;
	public static final String TIMESTAMP_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSS";


	/**
	 * @return Return scope (i.e. the list of school_ids) of a local administrator
	 */
	public static List<String> getLocalAdminScope(final UserInfos user) {
		Map<String, UserInfos.Function> functions = user.getFunctions();
		if (functions != null && functions.containsKey(DefaultFunctions.ADMIN_LOCAL)) {
			Function adminLocal = functions.get(DefaultFunctions.ADMIN_LOCAL);
			if (adminLocal != null) {
				return adminLocal.getScope();
			}
		}

		return new ArrayList<String>();
	}
    public static List<String> getUserIdAndGroupIds(UserInfos user) {
        final List<String> groupsAndUserIds = new ArrayList<>();
        groupsAndUserIds.add(user.getUserId());
        if (user.getGroupsIds() != null) {
            groupsAndUserIds.addAll(user.getGroupsIds());
        }
        return groupsAndUserIds;
    }

}
