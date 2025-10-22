(function(){
  const Security = {
    version: "1.0.1",
    safeWords: ["هاك", "اختراق", "تخريب", "جريمة", "فيروس", "قتل", "انتحار"],
    checkInput: function(input){
      return !this.safeWords.some(word => input.includes(word));
    }
  };

  window.Security = Security;
})();
