var expect = require("chai").expect;
var cardModel = require("../models/card.js");

var Card = cardModel.card;

describe('Card', function() {

  describe("properties", function(){
		//debe tener al menos alguna propiedad(palo) 
    it('should have a suit property', function(){
      var c = new Card(1, 'oro');
      expect(c).to.have.property('suit'); 
    });
		//debe tener al menos un numero
    it('should have a number property', function(){
      var c = new Card(1, 'oro');
      expect(c).to.have.property('number');
    });
  });

	//Mostrando cartas
  describe("#show", function(){
    it('should returns card', function(){
      var c = new Card(1, 'copa');
      expect(c.show()).to.be.eq("1: copa");
    });
  });
	//confronta las cartas
  describe("#confront", function(){
    var c = new Card(7, 'espada');
    var x = new Card(7, 'copa');
    var y = new Card(2, 'oro');
    //Cuando tiene mayor peso c retorna 1 
    describe("when this is better than argument", function(){
      it("should returns 1", function(){
        expect(c.confront(x)).to.be.eq(1);
      })
    });
		//cuando tiene menos peso x retorna -1
    describe("when this is worst than argument", function(){
      it("should returns -1", function(){
        expect(x.confront(c)).to.be.eq(-1);
      })
    });
		//cuando tiene mayor peso y deberia retornar 1 pero retorna 0
    describe("when this is better than argument", function(){
      it("should returns 1", function(){
        expect(y.confront(x)).to.be.eq(1);
      })
    });
  });
});

