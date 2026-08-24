$(function(){
  $(".menu-toggle").on("click",function(){$(".navbar nav").toggleClass("open");});
  $(".navbar nav a").on("click",function(){$(".navbar nav").removeClass("open");});

  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){$(entry.target).addClass("visible");observer.unobserve(entry.target);}
    });
  },{threshold:.12});
  $(".reveal").each(function(){observer.observe(this);});

  let counted=false;
  const statsObserver=new IntersectionObserver(entries=>{
    if(entries[0].isIntersecting&&!counted){
      counted=true;
      $("[data-target]").each(function(){
        const el=$(this),target=parseInt(el.data("target")),suffix=el.data("suffix"),start=0,duration=1300,startTime=null;
        function tick(t){if(!startTime)startTime=t;let p=Math.min((t-startTime)/duration,1);let v=Math.floor(p*target);el.text(v+suffix);if(p<1)requestAnimationFrame(tick);else el.text(target+suffix);}
        requestAnimationFrame(tick);
      });
    }
  },{threshold:.5});
  if($(".stats")[0])statsObserver.observe($(".stats")[0]);

  $(".chips button").on("click",function(){
    $(".chips button").removeClass("selected");$(this).addClass("selected");
    $("#inquiryType").val($(this).data("type"));
  });

  function toast(message){
    const t=$("#toast");t.text(message).addClass("show");
    setTimeout(()=>t.removeClass("show"),3500);
  }

  $("#message").on("submit",function(e){
    e.preventDefault();
    if(!$("#inquiryType").val()){toast("Please select an inquiry type.");return;}
    toast("Thank you! Your message has been received.");
    this.reset();$(".chips button").removeClass("selected");$("#inquiryType").val("");
  });

  $(".newsletter").on("submit",function(e){e.preventDefault();toast("Thank you for joining the movement!");this.reset();});
  $("#playDemo").on("click",function(){toast("Project video will be available soon.");});

  $(window).on("scroll",function(){
    $(".navbar:not(.solid)").toggleClass("scrolled",$(this).scrollTop()>30);
  });
});