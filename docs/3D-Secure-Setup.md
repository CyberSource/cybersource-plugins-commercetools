<div id="page">

<div id="main" class="aui-page-panel">

<div id="main-header">

# 3D Secure Setup

</div>

<div id="content" class="view">

<div id="main-content" class="wiki-content group">

# Cybersource

## Cardinal Payer Authentication (3D Secure)

To support payer authentication you will need to add some Javascript to your payment page

### Recommended reading

* [Cybersource Payer Authentication documentation](http://apps.cybersource.com/library/documentation/dev_guides/Payer_Authentication_SO_API/Payer_Authentication_SO_API.pdf)
* [Cardinal Cruise Hybrid Integration documentation](https://cardinaldocs.atlassian.net/wiki/spaces/CC/pages/360668/Cardinal+Cruise+Hybrid)

### Steps

1.  Include the Cardinal script appropriate for your environment. See <https://cardinaldocs.atlassian.net/wiki/display/CC/Songbird.js#Songbird.js-CDN> for URLs to use

2.  Configure the Cardinal script
    ```javascript
      Cardinal.configure({
        // in a development/test environment you may want to enable logging
        logging: {
          level: "on"
        }
      });
    ```

3.  Set up a listener for the Cardinal payments.setupComplete event. Your code will receive this event when the Cardinal code is ready. The payment form should be disabled until this event is received
    ```javascript
      Cardinal.on('payments.setupComplete', function(setupCompleteData){
        //allow interaction with your payment form
      });
    ```

4.  Set up a listener for the Cardinal payments.validated event. Your code will receive this event when the user has completed payer authentication. The listener will need to check the event status is successful and extract the response JWT to send to commerce tools. See [Authorize a Payment (With Payer Authentication)](Authorize-a-Payment-With-Payer-Authentication.md) for details of how the response JWT is sent
    
    ```javascript
    Cardinal.on("payments.validated", function (data, jwt) {
      // check status
      switch(data.ErrorNumber){
        case 0:
          // update commerce tools payment with jwt
        break;

        default:
          // handle payment not validated
        break;
      }
    });
    ```

</div>

</div>

</div>

</div>