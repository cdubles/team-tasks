const socket = io('http://localhost:8080');

$(function(){
    $("#header").load('header.html')
    
    //show create new project forum
    $("button#createNew").click(function(){$('div#newProject').toggle();})

    //submit new project
    $("button#makeProjectButton").click(function(){
        var name = $('input#projectName').val();
        var desc = $('input#description').val();
        var members = $('input#members').val();
        
        var projectData = {name:name, description:desc, members:members}
        $.ajax({
            type:'POST',
            url:'makeProject',
            data:projectData,
            success:function(res){
                console.log(res)
            }
        })
    })
})