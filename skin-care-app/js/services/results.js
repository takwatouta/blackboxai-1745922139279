let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

function displayResults(data) {
    document.getElementById('skinTypeResult').textContent = data.skinType;
    document.getElementById('issuesResult').textContent = data.issues.join('، ');
    document.getElementById('severityResult').textContent = data.severity;
    
    // Check for oily skin with acne
    if (data.skinType === 'دهنية' && data.issues.includes('حبوب')) {
        displayOilyAcneRoutine();
    } else {
        // Default product display
        const products = getRecommendedProducts(data.skinType, data.issues);
        const productsContainer = document.getElementById('recommendedProducts');
        
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'product-card bg-white rounded-xl shadow-md overflow-hidden border border-gray-100';
            productElement.innerHTML = `
                <div class="p-4">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center">
                            <div class="bg-indigo-100 p-3 rounded-full mr-3">
                                <i class="fas ${product.icon || 'fa-spa'} text-indigo-600"></i>
                            </div>
                            <div>
                                <h3 class="text-xl font-bold text-gray-800">${product.name}</h3>
                                <p class="text-gray-600">${product.description}</p>
                            </div>
                        </div>
                        <div class="flex flex-col items-center">
                            <span class="text-indigo-600 font-bold mb-2">${product.price}</span>
                            <button onclick="addToCart('${product.name}', ${product.price.replace('ريال','').trim()})" 
                                    class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center">
                                <i class="fas fa-cart-plus ml-2"></i>
                                <span>أضف للسلة</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            productsContainer.appendChild(productElement);
        });
    }
}

function displayOilyAcneRoutine() {
    const productsContainer = document.getElementById('recommendedProducts');
    productsContainer.innerHTML = '';

    // Morning Routine
    const morningRoutine = document.createElement('div');
    morningRoutine.className = 'col-span-full bg-blue-50 p-6 rounded-xl mb-6';
    morningRoutine.innerHTML = `
        <h3 class="text-xl font-bold text-blue-800 mb-4 flex items-center">
            <i class="fas fa-sun mr-2"></i> 🌅 الروتين الصباحي
        </h3>
        <div class="space-y-4">
            <div class="bg-white p-4 rounded-lg shadow">
                <h4 class="font-semibold text-blue-700">1. الغسول:</h4>
                <div class="flex items-center justify-between">
                    <p class="text-gray-700">- سيتافيل جنتل كلينزر (35 ريال)</p>
                    <button onclick="addToCart('سيتافيل جنتل كلينزر', 35)" 
                            class="bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm ml-2">
                        <i class="fas fa-cart-plus"></i>
                    </button>
                </div>
                <p class="text-gray-500 text-sm mt-1">- غسل الوجه بماء فاتر</p>
                <p class="text-gray-500 text-sm">- التطبيق بحركات دائرية لمدة دقيقة</p>
            </div>
            <div class="bg-white p-4 rounded-lg shadow">
                <h4 class="font-semibold text-blue-700">2. التونر:</h4>
                <div class="flex items-center justify-between">
                    <p class="text-gray-700">- ديكسونا تونر (25 ريال)</p>
                    <button onclick="addToCart('ديكسونا تونر', 25)" 
                            class="bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm ml-2">
                        <i class="fas fa-cart-plus"></i>
                    </button>
                </div>
                <p class="text-gray-500 text-sm mt-1">- تطبيق بقطنة نظيفة</p>
                <p class="text-gray-500 text-sm">- الانتظار دقيقة للامتصاص</p>
            </div>
            <div class="bg-white p-4 rounded-lg shadow">
                <h4 class="font-semibold text-blue-700">3. المرطب:</h4>
                <div class="flex items-center justify-between">
                    <p class="text-gray-700">- نيوتروجينا هيدرو بوست (30 ريال)</p>
                    <button onclick="addToCart('نيوتروجينا هيدرو بوست', 30)" 
                            class="bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm ml-2">
                        <i class="fas fa-cart-plus"></i>
                    </button>
                </div>
                <p class="text-gray-500 text-sm mt-1">- كمية صغيرة مع التدليك الخفيف</p>
            </div>
            <div class="bg-white p-4 rounded-lg shadow">
                <h4 class="font-semibold text-blue-700">4. واقي الشمس:</h4>
                <div class="flex items-center justify-between">
                    <p class="text-gray-700">- لاروش بوزيه SPF 50 (40 ريال)</p>
                    <button onclick="addToCart('لاروش بوزيه SPF 50', 40)" 
                            class="bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm ml-2">
                        <i class="fas fa-cart-plus"></i>
                    </button>
                </div>
                <p class="text-gray-500 text-sm mt-1">- تجديد كل 4 ساعات</p>
            </div>
        </div>
    `;
    productsContainer.appendChild(morningRoutine);

    // Evening Routine
    const eveningRoutine = document.createElement('div');
    eveningRoutine.className = 'col-span-full bg-purple-50 p-6 rounded-xl mb-6';
    eveningRoutine.innerHTML = `
        <h3 class="text-xl font-bold text-purple-800 mb-4 flex items-center">
            <i class="fas fa-moon mr-2"></i> 🌙 الروتين المسائي
        </h3>
        <div class="space-y-4">
            <div class="bg-white p-4 rounded-lg shadow">
                <h4 class="font-semibold text-purple-700">1. إزالة المكياج:</h4>
                <div class="flex items-center justify-between">
                    <p class="text-gray-700">- ماء ميسيلار من غارنييه (20 ريال)</p>
                    <button onclick="addToCart('ماء ميسيلار من غارنييه', 20)" 
                            class="bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm ml-2">
                        <i class="fas fa-cart-plus"></i>
                    </button>
                </div>
            </div>
            <div class="bg-white p-4 rounded-lg shadow">
                <h4 class="font-semibold text-purple-700">2. الغسول:</h4>
                <p class="text-gray-700">- نفس غسول الصباح</p>
            </div>
            <div class="bg-white p-4 rounded-lg shadow">
                <h4 class="font-semibold text-purple-700">3. علاج حب الشباب:</h4>
                <div class="flex items-center justify-between">
                    <p class="text-gray-700">- بنزويل بيروكسايد 2.5% (15 ريال)</p>
                    <button onclick="addToCart('بنزويل بيروكسايد 2.5%', 15)" 
                            class="bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm ml-2">
                        <i class="fas fa-cart-plus"></i>
                    </button>
                </div>
                <p class="text-gray-500 text-sm mt-1">- تطبيق على البثور فقط</p>
            </div>
            <div class="bg-white p-4 rounded-lg shadow">
                <h4 class="font-semibold text-purple-700">4. المرطب:</h4>
                <p class="text-gray-700">- نفس مرطب الصباح</p>
            </div>
        </div>
    `;
    productsContainer.appendChild(eveningRoutine);

    // Tips Section
    const tipsSection = document.createElement('div');
    tipsSection.className = 'col-span-full bg-amber-50 p-6 rounded-xl mb-6';
    tipsSection.innerHTML = `
        <h3 class="text-xl font-bold text-amber-800 mb-4 flex items-center">
            <i class="fas fa-lightbulb mr-2"></i> نصائح مهمة
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-white p-4 rounded-lg shadow">
                <h4 class="font-semibold text-amber-700">العناية اليومية:</h4>
                <ul class="list-disc list-inside text-gray-700 space-y-1 mt-2">
                    <li>تغيير غطاء الوسادة أسبوعياً</li>
                    <li>تجنب لمس الوجه</li>
                    <li>شرب 8 أكواب ماء يومياً</li>
                    <li>تناول طعام صحي قليل الدهون</li>
                    <li>تنظيف الهاتف بانتظام</li>
                </ul>
            </div>
            <div class="bg-white p-4 rounded-lg shadow">
                <h4 class="font-semibold text-amber-700">إرشادات إضافية:</h4>
                <ul class="list-disc list-inside text-gray-700 space-y-1 mt-2">
                    <li>البدء بمنتج واحد جديد كل أسبوعين</li>
                    <li>استخدام قناع طين مرة أسبوعياً</li>
                    <li>تجنب الإفراط في تقشير البشرة</li>
                </ul>
            </div>
        </div>
    `;
    productsContainer.appendChild(tipsSection);

    // Warnings Section
    const warningsSection = document.createElement('div');
    warningsSection.className = 'col-span-full bg-red-50 p-6 rounded-xl';
    warningsSection.innerHTML = `
        <h3 class="text-xl font-bold text-red-800 mb-4 flex items-center">
            <i class="fas fa-exclamation-triangle mr-2"></i> تحذيرات
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-white p-4 rounded-lg shadow">
                <h4 class="font-semibold text-red-700">توقفي عن الاستخدام إذا:</h4>
                <ul class="list-disc list-inside text-gray-700 space-y-1 mt-2">
                    <li>حكة شديدة</li>
                    <li>احمرار غير عادي</li>
                    <li>تقشير زائد</li>
                    <li>حرقان مستمر</li>
                </ul>
            </div>
            <div class="bg-white p-4 rounded-lg shadow">
                <h4 class="font-semibold text-red-700">مؤشرات يجب مراقبتها:</h4>
                <ul class="list-disc list-inside text-gray-700 space-y-1 mt-2">
                    <li>ظهور بثور جديدة</li>
                    <li>تحسن أو تفاقم الحالة</li>
                    <li>تأثير الدورة الشهرية</li>
                    <li>ردود فعل المنتجات</li>
                </ul>
            </div>
        </div>
        <div class="mt-4 bg-white p-4 rounded-lg shadow">
            <h4 class="font-semibold text-gray-800">ملاحظات طبية:</h4>
            <p class="text-gray-700 mt-2">استشارة طبيب الجلد إذا لم يتحسن الوضع خلال شهرين</p>
        </div>
        <div class="mt-4 bg-white p-4 rounded-lg shadow">
            <p class="text-gray-700"><span class="font-bold">المجموع التقريبي:</span> 165 ريال</p>
            <p class="text-gray-500 text-sm mt-1">يمكن تخفيض التكلفة باختيار بدائل أقل سعراً أو شراء العبوات الاقتصادية</p>
        </div>
    `;
    productsContainer.appendChild(warningsSection);
}

function getRecommendedProducts(skinType, issues) {
    // هذه الدالة يجب أن تعيد قائمة بالمنتجات المناسبة
    // يمكنك إضافة المزيد من المنتجات حسب الحاجة
    return [
        // مثال:
        {
            name: "مرطب للبشرة الدهنية",
            description: "مرطب خفيف لا يسد المسام",
            price: "45 ريال",
            icon: "fa-leaf"
        }
    ];
}

function addToCart(productName, productPrice) {
    const existingItem = cartItems.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({
            name: productName,
            price: productPrice,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cartItems));
    
    // إشعار للمستخدم
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center animate-bounce';
    notification.innerHTML = `
        <i class="fas fa-check-circle mr-2"></i>
        <span>تمت إضافة ${productName} إلى السلة</span>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
