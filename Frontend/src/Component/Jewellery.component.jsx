import { useState } from 'react';
import { FiHeart, FiStar, FiShoppingCart, FiChevronLeft, FiChevronRight,FiX } from 'react-icons/fi';

const Jewellery = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Sample products data
  const products = [  
    
    {
      id: 8,
      title: "Flower Shape silver ring featuring lustrous white AD gems",
      price: 629,
      originalPrice: 964,
      discount: 35,
      setPrice: 259,
      bulkOffer: "Buy any 5 & Get @ ₹140",
      warranty: "2 Year warranty Rose Gold Plated...",
      rating: 5,
      images: [
        '1710404347490.jpeg',
        '1710404347491.jpeg',
      ]
    },
    {
      id: 9,
      title: "2 Year warranty Rose Gold plated Beautiful AD Stone Ring",
      price: 499,
      originalPrice: 694,
      discount: 35,
      setPrice: 259,
      bulkOffer: "Buy any 5 & Get @ ₹140",
      warranty: "2 Year warranty Rose Gold Plated...",
      rating: 5,
      images: [
        '1728212936490.jpeg',
        '1728212936491.jpeg',
      ]
    },
    {
      id: 10,
      title: "Stunning Round Shaped Gold AD Finger Ring",
      price: 699,
      originalPrice: 999,
      discount: 35,
      setPrice: 259,
      bulkOffer: "Buy any 5 & Get @ ₹140",
      warranty: "2 Year warranty Rose Gold Plated...",
      rating: 5,
      images: [
        '1709888904279.jpeg',
        '1709888904280.jpeg'
      ]
    },
    {
      id: 11,
      title: "Glamorous silver ring enhanced by stri...",
      price: 299,
      originalPrice: 464,
      discount: 35,
      setPrice: 159,
      bulkOffer: "Buy any 5 & Get @ ₹140",
      warranty: "2 Year warranty Rose Gold Plated...",
      rating: 5,
      images: [
        '1689917871600.jpeg',
        '1689917871601.jpeg'
      ]
    },
    {
      id: 12,
      title: "Gorgeous Multicolor Kundan Adjustable Traditional Ring",
      price: 499,
      originalPrice: 464,
      discount: 35,
      setPrice: 659,
      bulkOffer: "Buy any 5 & Get @ ₹140",
      warranty: "2 Year warranty Rose Gold Plated...",
      rating: 5,
      images: [
        '1689920293551.jpeg',
        '1689920293552.jpeg'
      ]
    },
    {
        id: 1,
        title: "Stunning Floral Rose Gold AD Finger Ring",
        price: 449,
        originalPrice: 999,
        discount: 60,
        setPrice: 299,
        bulkOffer: "Buy any 7 & Get @ ₹130",
        warranty: "2 Year warranty Gold Plated AD Stone...",
        rating: 4,
        images: [
          '1690539896539.jpeg',
          '1690539896541.jpeg'
        ]
      },
      {
        id: 2,
        title: "Silver AD Finger Ring",
        price: 499,
        originalPrice: 964,
        discount: 35,
        setPrice: 359,
        bulkOffer: "Buy any 5 & Get @ ₹140",
        warranty: "2 Year warranty Rose Gold Plated...",
        rating: 5,
        images: [
          '1690540286587.jpeg',
          '1690540286589.jpeg'
        ]
      },

      {
        id: 3,
        title: "American Diamond Silver White Finger Ring",
        price: 599,
        originalPrice: 1464,
        discount: 35,
        setPrice: 459,
        bulkOffer: "Buy any 5 & Get @ ₹140",
        warranty: "2 Year warranty Rose Gold Plated...",
        rating: 5,
        images: [
          '1690541110336.jpeg',
          '1690541110338.jpeg'
        ]
      },
      {
        id: 5,
        title: "Floral American Diamond White AD Silver Finger Ring",
        price: 499,
        originalPrice: 744,
        discount: 35,
        setPrice: 209,
        bulkOffer: "Buy any 5 & Get @ ₹140",
        warranty: "2 Year warranty Rose Gold Plated...",
        rating: 5,
        images: [
          '1690611999497.jpeg',
          '1690611999499.jpeg'
        ]
      },


      {
        id: 4,
        title: "Fancy American Diamond Round Shaped Rose Gold Finger Ring",
        price: 589,
        originalPrice: 1299,
        discount: 35,
        setPrice: 359,
        bulkOffer: "Buy any 5 & Get @ ₹140",
        warranty: "2 Year warranty Rose Gold Plated...",
        rating: 5,
        images: [
          '1690611147876.jpeg',
          '1690611147878.jpeg'
        ]
      },

      {
        id: 6,
        title: "Rose Gold Plated AD Studded Round Finger Ring",
        price: 499,
        originalPrice: 999,
        discount: 35,
        setPrice: 359,
        bulkOffer: "Buy any 5 & Get @ ₹140",
        warranty: "2 Year warranty Rose Gold Plated...",
        rating: 5,
        images: [
          '1709888706485.jpeg',
          '1709888706484.jpeg'
        ]
      },
      {
        id: 7,
        title: "2 Year warranty Gold Plated Pave AD studded Open Statement Ring",
        price: 499,
        originalPrice: 664,
        discount: 35,
        setPrice: 259,
        bulkOffer: "Buy any 5 & Get @ ₹140",
        warranty: "2 Year warranty Rose Gold Plated...",
        rating: 5,
        images: [
          '1728214154559.jpeg',
          '1728214154560.jpeg'
        ]
      },

  ];

  const openProductPopup = (product) => {
    setSelectedProduct(product);
    setCurrentImageIndex(0);
  };

  const handleImageNavigation = (direction) => {
    setCurrentImageIndex(prev => 
      direction === 'next' 
        ? (prev + 1) % selectedProduct.images.length 
        : (prev - 1 + selectedProduct.images.length) % selectedProduct.images.length
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-600">JEWELLERY</h1>
          <div className="flex items-center gap-4">
            <FiHeart className="text-xl cursor-pointer" />
            <FiShoppingCart className="text-xl cursor-pointer" />
          </div>
        </div>
      </header>

 



      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div 
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
            onClick={() => openProductPopup(product)}
          >
            <div className="relative">
              <img 
                src={product.images[0]} 
                alt={product.title}
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">
                {product.discount}% OFF
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                {[...Array(5)].map((_, i) => (
                  <FiStar 
                    key={i}
                    className={`text-sm ${i < product.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>

              <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
              
              <div className="flex items-center gap-4 mb-2">
                <span className="text-xl font-bold text-purple-600">₹{product.price}</span>
                <span className="text-gray-500 line-through">₹{product.originalPrice}</span>
              </div>

              <div className="text-sm text-gray-600 space-y-1">
                <p>{product.warranty}</p>
                <p className="text-purple-600 font-medium">Set @ ₹{product.setPrice}</p>
                <p className="text-green-600">{product.bulkOffer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Popup Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full overflow-hidden">
            {/* Close Button */}
            <button 
              className="absolute top-4 right-4 text-gray-600 hover:text-purple-600 z-10"
              onClick={() => setSelectedProduct(null)}
            >
              <FiX className="text-2xl" />
            </button>

            {/* Image Carousel */}
            <div className="relative">
              <img 
                src={selectedProduct.images[currentImageIndex]} 
                alt={selectedProduct.title}
                className="w-full h-96 object-cover"
              />
              
              {/* Navigation Arrows */}
              <div className="absolute top-1/2 w-full flex justify-between px-4 transform -translate-y-1/2">
                <button 
                  className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
                  onClick={() => handleImageNavigation('prev')}
                >
                  <FiChevronLeft className="text-2xl" />
                </button>
                <button 
                  className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
                  onClick={() => handleImageNavigation('next')}
                >
                  <FiChevronRight className="text-2xl" />
                </button>
              </div>
            </div>

            {/* Product Details */}
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">{selectedProduct.title}</h2>
              
              <div className="flex items-center gap-4 mb-4">
                <span className="text-2xl font-bold text-purple-600">
                ₹{selectedProduct.price}
                </span>
                <span className="text-gray-500 line-through">
                ₹{selectedProduct.originalPrice}
                </span>
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm">
                  {selectedProduct.discount}% OFF
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <FiStar className="text-yellow-400" />
                  <span className="font-medium">{selectedProduct.rating}/5 Ratings</span>
                </div>
                <p className="text-gray-600">{selectedProduct.warranty}</p>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <p className="text-purple-600 font-medium">
                    {selectedProduct.bulkOffer}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2">
                  <FiShoppingCart /> Add to Cart
                </button>
                <button className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300">
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jewellery;