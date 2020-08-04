package isv.payments.exception;

import java.io.Serializable;

public class PaymentException extends Exception implements Serializable {

  private static final long serialVersionUID = 1115411987592606514L;

  public PaymentException(Exception caughtException) {
    super(caughtException);
  }

  public PaymentException(String message) {
    super(message);
  }

  public PaymentException(String message, Exception cause) {
    super(message, cause);
  }

}
