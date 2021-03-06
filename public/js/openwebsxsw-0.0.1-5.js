/* Wire stripe payments */
$(document).ready(function(){
  
  log('Ready...')
  
  // Global
  window.OW = {}
  
  // Check for touch events (note: this is not exhaustive)
  if( !('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) 
    document.documentElement.className = "no-touch"


  // Get user's location and stash...
  if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError)
  } 
  else geoError("Not supported.")
  
  function geoSuccess(position) {
    OW.position = position
  }

  function geoError(msg) {
    log(arguments)
    OW.position = {}
  }
  
  /* Handle Signup Form ****************************************/
  
  var $signupForm = $('#signup-form')
    , $signupButton = $('#signup-button')
    
  if($signupForm.length){
    
    $signupButton.on('click', function(){
      
      $('.error').removeClass('error')
      
      var $inputEmail = $('input[type="email"]')
        , $inputName = $('input[type="name"]')

      // Validate inputs
      if( $inputName.val().length < 2 ){
        log('Bad name.')
        $inputName
          .val('')
          .addClass('error')
          .focus()
        return false
      } else if( !( /(.+)@(.+){2,}\.(.+){2,}/.test( $inputEmail.val() ) ) ){
        log('Bad email.')
        $inputEmail
          .val('')
          .addClass('error')
          .focus()
        return false
      }        
      
      // Populate lat/lon if it's there...
      $('#signup-lat').val( OW.position.coords.latitude || '')
      $('#signup-lon').val( OW.position.coords.longitude || '')
      
      $.post('/signup', $signupForm.serialize(), function(resp){
        var r = JSON.parse(resp)
        log(r)
        $signupForm.find('input').val('')
        alert("Signup was successful. Stay tuned...")
        
      }) // end post
      
      return false

    }) // end click()
    
  }

  /* End Signup Form *******************************************/
  


  /* Handle Stripe Invoice Payments... *************************/
  
  var $stripeButton = $('#stripe-button')
  
  if($stripeButton.length){
    
    var stripeTokenCallback = function(res){
      
      var token = res.id
      
      var body = {
        amount : stripeConfig.amount,
        currency : stripeConfig.currency,
        card : token,
        description : stripeConfig.description
      }
      
      $.post('/charge', body, function(resp){
        var r = JSON.parse(resp)
        log(r)
        alert("Payment successful! You wil now be redirected to the home page.")
        location.href = "/"
      }) // end post
    }
    
    var stripeConfig = {
      key:         $stripeButton[0].dataset.key,
      address:     false,
      amount:      $stripeButton[0].dataset.amount,
      name:        $stripeButton[0].dataset.name,
      description: $stripeButton[0].dataset.description,
      currency:    $stripeButton[0].dataset.currency, 
      token:       stripeTokenCallback
    }
    
    $stripeButton.on('click', function(){
      StripeCheckout.open(stripeConfig)
      return false
    })
    
  } // end if stripeButton length
  /* End Stripe Invoice Payments... ****************************/
  
})
