package com.cybersource.commercetools.mapping.util;

import java.util.Map;

public class MapUtil {

    public static void putIfNotNull(Map map, Object key, Object value) {
        if (value != null) {
            map.put(key, value);
        }
    }

}
