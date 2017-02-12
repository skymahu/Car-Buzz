angular.module('CARUSER.controllers.Paypal', []).constant('shopSettings',{
   
   
    payPalSandboxId: 'Ab2imDDDXsag0L1ziKVfV2J8C6-VaV19xMyxO6BATrrBbWnk7bx1rxEz5_zhI17719o0MZngKupynKPF',
    payPalProductionId: 'ARWG7oEq6z9inDwXBQUsmnZZvoy2FLfvxhyk-COdoMy1ixfQFPiU94N0uaYKUggaPE-FW69sLq3HQb8s',
    payPalEnv: 'PayPalEnvironmentProduction',                  //'PayPalEnvironmentSandbox',                      // 'PayPalEnvironmentSandbox',                  //'PayPalEnvironmentNoNetwork',   // for testing  production for production
    payPalShopName : 'CARUSER',
    payPalMerchantPrivacyPolicyURL : 'url to policy',
    payPalMerchantUserAgreementURL : ' url to user agreement '
   
   
   
    
})

.controller('PaypalController', function ($rootScope, $scope, PaypalService) {

    $scope.paypalbutton = function (evt)
    {
        alert("enter paypal button");

        try
        {
            PaypalService.initPaymentUI().then(function () {
                PaypalService.makePayment("0.01", "Total");
            });
        } catch (e)
        {
            alert(e.message);
        }
    }

    
 

});
 


