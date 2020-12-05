$(function(){
    $('div#signup').hide()
    $('button#LoginSwitch').click(function(){
        $('div#signup').hide()
        $('div#login').show()
    })

    $('button#SignUpSwitch').click(function(){
        $('div#signup').show()
         $('div#login').hide()
    })
    // try login
    $('button#loginSubmit').click(function(){

        var userName = $("input#loginUser").val()
        var password = $("input#loginPassword").val()

        var loginData = {user:userName,password:password}
        console.log(loginData)
        $.ajax({
            type:'POST',
            url:'login',
            data:loginData,
            success:function(res){
                console.log(res)
            }    
        })
    });

    //try sign in
    $('button#signupSubmit').click(function(){
        var userName = $("input#signUser").val()
        var firstName = $("input#signFirst").val()
        var password = $("input#signPassword").val()

        var signupData = {username:userName,password:password,firstname:firstName}

        $.ajax({
            type:'POST',
            url:'signup',
            data:signupData,
            success:function(res){
                console.log(res)
            }
        })
    })
})