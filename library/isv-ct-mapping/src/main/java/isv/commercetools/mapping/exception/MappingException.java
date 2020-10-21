package isv.commercetools.mapping.exception;

/**
 * An exception which is thrown when an error occurs during the mapping process between the payment service and Commercetools values
 */
public class MappingException extends RuntimeException {

    private static final long serialVersionUID = -3417840254290315324L;

    public MappingException(String reason) {
        super(reason);
    }
}
