package isv.commercetools.reference.application.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FlexKeys {

  private String captureContext;
  private String verificationContext;

}
