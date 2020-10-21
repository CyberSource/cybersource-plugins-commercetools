package isv.commercetools.sync.exception;

public class SyncException extends RuntimeException {

  private static final long serialVersionUID = 8527802585691418822L;

  public SyncException(String reason) {
    super(reason);
  }
}
