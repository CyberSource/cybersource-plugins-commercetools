package isv.commercetools.mapping.types;

import io.sphere.sdk.types.Type;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public final class TypeCache {

    private static Map<String,String> idToKeyMap;

    private TypeCache() {}

    public static void populate(List<Type> types) {
        idToKeyMap = types.stream().collect(Collectors.toMap(Type::getId, Type::getKey));
    }

    public static String key(String typeId) {
        return idToKeyMap.get(typeId);
    }

}
