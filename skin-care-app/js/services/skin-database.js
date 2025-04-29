const skinDatabase = {
  // بيانات أنواع البشرة والمنتجات المناسبة
  skinTypes: {
    dry: {
      description: "بشرة جافة تحتاج لترطيب مكثف",
      recommended: [
        {id: 1, name: "مرطب كثيف", category: "moisturizer"},
        {id: 2, name: "زيت ليل", category: "oil"}
      ]
    },
    oily: {
      description: "بشرة دهنية تحتاج منتجات خفيفة",
      recommended: [
        {id: 3, name: "جل مرطب", category: "gel"},
        {id: 4, name: "منظف لطيف", category: "cleanser"}
      ]
    },
    combination: {
      description: "بشرة مختلطة تحتاج توازن في الترطيب",
      recommended: [
        {id: 5, name: "مرطب متوازن", category: "balancing"},
        {id: 6, name: "تونر", category: "toner"}
      ]
    }
  },

  // دالة للحصول على المنتجات حسب نوع البشرة
  getProductsBySkinType: function(skinType) {
    return this.skinTypes[skinType] || [];
  }
};

export default skinDatabase;