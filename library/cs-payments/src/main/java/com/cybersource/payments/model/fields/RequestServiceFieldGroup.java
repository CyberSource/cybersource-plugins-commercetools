package com.cybersource.payments.model.fields;

import java.util.Map;

/***
 * A Request Service Field Group is a group of fields which are used in a Cybersource Name Value Pair request.
 * The extra fields map allows users to add fields to the Cybersource Request which have not been specifically defined.
 */
public interface RequestServiceFieldGroup {

  String getFieldGroupPrefix();

  Map<String, String> getExtraFields();

}
