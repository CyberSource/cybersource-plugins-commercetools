package isv.payments.transformer;

import isv.payments.model.CybersourceRequest;
import isv.payments.model.fields.RequestServiceFieldGroup;
import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Stream;
import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.reflect.FieldUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/***
 * Transforms a Cybersource Request object to the Map structure required to use the Simple Order SDK
 */
public class RequestToMapTransformer {

  private static final Logger LOGGER = LoggerFactory.getLogger(RequestToMapTransformer.class);

  public Map<String, String> transform(CybersourceRequest request) {
    Map<String, String> result = new HashMap<>();
    request.getFieldGroups().forEach(fieldGroup -> addFieldsToMap(result, fieldGroup));
    return result;
  }

  private void addFieldsToMap(Map<String, String> resultMap, RequestServiceFieldGroup values) {
    mapServiceFields(resultMap, values);
    mapExtraFields(resultMap, values);
  }

  private void mapServiceFields(Map<String, String> resultMap, RequestServiceFieldGroup requestFields) {
    Stream.of(FieldUtils.getAllFields(requestFields.getClass()))
      .filter(field -> !field.isSynthetic())
      .filter(field -> ! field.getName().equals("extraFields"))
      .forEach(field -> addFieldValueToMap(requestFields, resultMap, field.getName()));
  }

  private void mapExtraFields(
    Map<String, String> resultMap,
    RequestServiceFieldGroup requestFields
  ) {
    requestFields.getExtraFields().forEach((k, v) -> {
      final String prefixedKey = String.format("%s%s", requestFields.getFieldGroupPrefix(), k);
      resultMap.put(prefixedKey, v);
    });
  }

  private void addFieldValueToMap(RequestServiceFieldGroup requestFields, Map<String, String> resultMap, String fieldName) {
    try {
      final String prefixedKey = requestFields.getFieldGroupPrefix() + fieldName;
      String newValue = BeanUtils.getProperty(requestFields, fieldName);
      if (StringUtils.isNotBlank(newValue)) {
        resultMap.put(prefixedKey, newValue);
      }
    } catch (NoSuchMethodException | InvocationTargetException | IllegalAccessException e) {
      LOGGER.warn(
        String.format("Could not access field %s on field group of type %s",
          fieldName,
          requestFields.getClass().getSimpleName())
      );
    }
  }
}
