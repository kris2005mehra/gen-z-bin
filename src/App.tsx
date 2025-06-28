import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CameraIcon, 
  Trash2Icon, 
  DollarSignIcon, 
  UserIcon, 
  CheckCircleIcon,
  LeafIcon,
  RecycleIcon,
  MapPinIcon,
  ArrowRightIcon,
  MenuIcon,
  XIcon,
  TreePineIcon,
  SproutIcon,
  GlobeIcon,
  BellIcon,
  UploadIcon
} from 'lucide-react';
import { classifier } from '@/lib/waste-classifier';

// Reference images for waste types
const wasteTypeReferences = {
  plastic: 'https://tse2.mm.bing.net/th?id=OIP.XKwEHNKrNqK7dNzz41_bbgHaE7&pid=Api&P=0&h=180',
  paper: 'https://tse3.mm.bing.net/th?id=OIP.oE5s9kTTIWW2vixaKz6yCgHaE7&pid=Api&P=0&h=180',
  metal: 'https://tse1.mm.bing.net/th?id=OIP.EXMQ4xw0UGGfBn0QKxZeiAHaE8&pid=Api&P=0&h=180',
  ewaste: 'https://tse3.mm.bing.net/th?id=OIP.1kf3SzkxPbsHxj_n3ahpggHaE7&pid=Api&P=0&h=180',
  glass: 'https://www.epa.gov/sites/default/files/2018-03/glass_bottles_materials_ff.jpg',
  trash: 'https://experiencelife.lifetime.life/wp-content/uploads/2021/02/Talking-Trash-e1746736243231.jpg',
};

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [wasteType, setWasteType] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [showTransaction, setShowTransaction] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedDealer, setSelectedDealer] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [binWeight, setBinWeight] = useState(0);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    async function loadModel() {
      const success = await classifier.loadModel();
      setModelLoaded(success);
    }
    loadModel();
  }, []);

  const analyzeWasteType = async (imageElement: HTMLImageElement) => {
    try {
      const result = await classifier.classifyImage(imageElement);
      return {
        type: result.className.charAt(0).toUpperCase() + result.className.slice(1),
        confidence: result.confidence
      };
    } catch (error) {
      console.error('Error classifying image:', error);
      return { type: 'Unknown', confidence: 0 };
    }
  };

  const handleStartProcess = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (imageRef.current) {
      const { type, confidence } = await analyzeWasteType(imageRef.current);
      setWasteType(type + ' Waste');
      setConfidence(confidence);
    }
    
    const weight = 2.5;
    setBinWeight(prevWeight => prevWeight + weight);
    setIsProcessing(false);

    if (binWeight + weight >= 20) {
      await notifyAuthorities();
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setUploadedImage(previewUrl);
    setIsProcessing(true);
    
    // Wait for the image to load
    const img = new Image();
    img.src = previewUrl;
    await new Promise(resolve => img.onload = resolve);
    
    const { type, confidence } = await analyzeWasteType(img);
    setWasteType(type + ' Waste');
    setConfidence(confidence);
    
    const weight = 2.5;
    setBinWeight(prevWeight => prevWeight + weight);
    setIsProcessing(false);

    if (binWeight + weight >= 20) {
      await notifyAuthorities();
    }
  };

  const notifyAuthorities = async () => {
    try {
      console.log('Bin is full, notifying authorities');
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const handleDealerSelect = (dealer: string) => {
    setSelectedDealer(dealer);
  };

  const handleSchedulePickup = () => {
    setShowConfirmation(true);
    setActiveSection('confirmation');
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="eco-gradient text-white py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <RecycleIcon className="w-8 h-8" />
              <span className="text-xl sm:text-2xl font-bold">GenZ Bin</span>
            </div>
            
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>

            <div className="hidden md:flex space-x-6">
              <button 
                onClick={() => setActiveSection('home')}
                className="hover:text-green-200 transition"
              >
                Home
              </button>
              <button 
                onClick={() => setActiveSection('process')}
                className="hover:text-green-200 transition"
              >
                Start Recycling
              </button>
              <button 
                onClick={() => setActiveSection('locations')}
                className="hover:text-green-200 transition"
              >
                Locations
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden mt-4 space-y-2">
              <button 
                onClick={() => {
                  setActiveSection('home');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left py-2 hover:text-green-200 transition"
              >
                Home
              </button>
              <button 
                onClick={() => {
                  setActiveSection('process');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left py-2 hover:text-green-200 transition"
              >
                Start Recycling
              </button>
              <button 
                onClick={() => {
                  setActiveSection('locations');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left py-2 hover:text-green-200 transition"
              >
                Locations
              </button>
            </div>
          )}
        </div>
      </nav>

      {activeSection === 'home' && (
        <div>
          <div className="hero-pattern py-16 sm:py-24">
            <div className="container mx-auto px-4 sm:px-6 text-center">
              <div className="glass-card p-8 rounded-2xl max-w-4xl mx-auto">
                <GlobeIcon className="w-16 h-16 text-green-600 mx-auto mb-6 animate-spin-slow" />
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-800 mb-4 sm:mb-6">
                  Smart Waste Management for a Better Future
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
                  Join the revolution in recycling. Use AI-powered waste sorting to earn money while saving the planet.
                </p>
                <Button 
                  className="eco-button text-white text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-8 rounded-full"
                  onClick={() => setActiveSection('process')}
                >
                  Start Recycling Now <ArrowRightIcon className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          <div className="py-16 sm:py-24 leaf-pattern">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12">
                <Card className="nature-card">
                  <CardContent className="p-8">
                    <TreePineIcon className="w-16 h-16 text-green-600 mx-auto mb-6" />
                    <h3 className="text-2xl font-semibold mb-4">Eco-Friendly</h3>
                    <p className="text-gray-600">Reduce your carbon footprint and contribute to a sustainable future</p>
                  </CardContent>
                </Card>

                <Card className="nature-card">
                  <CardContent className="p-8">
                    <DollarSignIcon className="w-16 h-16 text-green-600 mx-auto mb-6" />
                    <h3 className="text-2xl font-semibold mb-4">Earn Money</h3>
                    <p className="text-gray-600">Get paid for your recyclable waste at competitive rates</p>
                  </CardContent>
                </Card>

                <Card className="nature-card sm:col-span-2 md:col-span-1">
                  <CardContent className="p-8">
                    <SproutIcon className="w-16 h-16 text-green-600 mx-auto mb-6" />
                    <h3 className="text-2xl font-semibold mb-4">Smart AI</h3>
                    <p className="text-gray-600">Advanced AI technology for accurate waste classification</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <div className="py-16 sm:py-24 bg-gradient-to-b from-green-50 to-blue-50">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
                {[
                  { value: '10K+', label: 'Users', icon: UserIcon },
                  { value: '50K', label: 'KG Recycled', icon: RecycleIcon },
                  { value: '100+', label: 'Centers', icon: MapPinIcon },
                  { value: '₹2M+', label: 'Paid Out', icon: DollarSignIcon }
                ].map((stat, index) => (
                  <div key={index} className="stats-card p-6 rounded-xl text-center">
                    <stat.icon className="w-10 h-10 text-green-600 mx-auto mb-4" />
                    <p className="text-3xl sm:text-4xl font-bold text-green-600">{stat.value}</p>
                    <p className="text-gray-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'process' && (
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-green-800 mb-8 sm:mb-12">Waste Processing Center</h2>
            
            <Card className="bg-white shadow-xl p-4 sm:p-6 rounded-2xl mb-6">
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <BellIcon className="w-8 h-8 text-green-600" />
                    <div>
                      <h3 className="text-lg font-semibold">Bin Status</h3>
                      <p className="text-sm text-gray-600">Current capacity: {binWeight.toFixed(1)}kg / 20kg</p>
                    </div>
                  </div>
                  <div className="w-32 h-2 bg-gray-200 rounded-full">
                    <div 
                      className={`h-full rounded-full ${
                        binWeight >= 20 ? 'bg-red-500' : 
                        binWeight >= 15 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${(binWeight / 20) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 sm:gap-8">
              <Card className="bg-white shadow-xl p-4 sm:p-6 rounded-2xl">
                <CardContent>
                  <div className="flex items-center space-x-4 mb-6">
                    <CameraIcon className="w-8 sm:w-10 h-8 sm:h-10 text-blue-500" />
                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold text-blue-800">AI Waste Analysis</h2>
                      <p className="text-sm sm:text-base text-gray-600">Our AI will analyze your waste in real-time</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {isProcessing ? (
                      <div className="border-2 border-blue-200 rounded-lg p-8 text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-blue-600">Processing waste image...</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                          <div className="relative">
                            <video 
                              className="w-full h-48 object-cover rounded-lg bg-black"
                              autoPlay 
                              muted 
                              playsInline
                            ></video>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <CameraIcon className="w-16 h-16 text-white opacity-50" />
                            </div>
                          </div>
                          <p className="text-gray-600 mt-4">AI Camera Active</p>
                          <Button 
                            className="mt-4 bg-blue-600 text-white hover:bg-blue-700"
                            onClick={handleStartProcess}
                          >
                            Capture & Analyze
                          </Button>
                        </div>

                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                          <div className="relative">
                            {uploadedImage ? (
                              <img 
                                src={uploadedImage} 
                                alt="Uploaded waste"
                                className="w-full h-48 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-full h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                                <UploadIcon className="w-16 h-16 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <p className="text-gray-600 mt-4">Upload Image</p>
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                          <Button 
                            className="mt-4 bg-blue-600 text-white hover:bg-blue-700"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            Upload & Analyze
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-xl p-4 sm:p-6 rounded-2xl">
                <CardContent>
                  <div className="flex items-center space-x-4 mb-6">
                    <RecycleIcon className="w-8 sm:w-10 h-8 sm:h-10 text-green-600" />
                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold text-green-800">Waste Type Reference</h2>
                      <p className="text-sm sm:text-base text-gray-600">Examples of different waste categories</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { type: 'Plastic', image: wasteTypeReferences.plastic },
                      { type: 'Paper', image: wasteTypeReferences.paper },
                      { type: 'Metal', image: wasteTypeReferences.metal },
                      { type: 'E-Waste', image: wasteTypeReferences.ewaste },
                      { type: 'Glass', image: wasteTypeReferences.glass },
                      { type: 'Trash', image: wasteTypeReferences.trash }
                    ].map((item, index) => (
                      <div key={index} className="rounded-lg overflow-hidden shadow-md">
                        <img 
                          src={item.image} 
                          alt={item.type}
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-2 bg-white text-center">
                          <p className="font-semibold text-sm">{item.type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {wasteType && (
                <>
                  <Card className="bg-white shadow-xl p-4 sm:p-6 rounded-2xl">
                    <CardContent>
                      <div className="flex items-center space-x-4 mb-6">
                        <Trash2Icon className="w-8 sm:w-10 h-8 sm:h-10 text-green-600" />
                        <div>
                          <h2 className="text-lg sm:text-xl font-semibold text-green-800">Analysis Result</h2>
                          <p className="text-sm sm:text-base text-gray-600">AI-detected waste classification</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-green-50 rounded-lg p-4">
                          <p className="text-xl sm:text-2xl text-center text-green-700 font-bold">{wasteType}</p>
                          <div className="mt-4 space-y-2">
                            <p className="text-gray-600"><span className="font-semibold">Composition:</span> 100% recyclable {wasteType.toLowerCase()}</p>
                            <p className="text-gray-600"><span className="font-semibold">Condition:</span> Clean and sorted</p>
                            <p className="text-gray-600"><span className="font-semibold">Weight:</span> ~2.5 kg</p>
                            <p className="text-gray-600"><span className="font-semibold">Confidence:</span> {(confidence * 100).toFixed(1)}%</p>
                          </div>
                        </div>
                        <Button 
                          className="w-full bg-green-600 text-white hover:bg-green-700"
                          onClick={() => setShowTransaction(true)}
                        >
                          View Available Dealers
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {showTransaction && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card className="bg-white shadow-xl p-4 sm:p-6 rounded-2xl">
                        <CardContent>
                          <div className="flex items-center space-x-4 mb-6">
                            <MapPinIcon className="w-8 sm:w-10 h-8 sm:h-10 text-blue-500" />
                            <div>
                              <h2 className="text-lg sm:text-xl font-semibold text-blue-800">Nearby Dealers</h2>
                              <p className="text-sm sm:text-base text-gray-600">Select your preferred recycler</p>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div 
                              className={`p-4 border rounded-lg cursor-pointer transition ${
                                selectedDealer === 'green' ? 'bg-green-50 border-green-500' : 'hover:bg-gray-50'
                              }`}
                              onClick={() => handleDealerSelect('green')}
                            >
                              <p className="font-semibold">Green Recyclers Ltd.</p>
                              <p className="text-gray-600">1.2 km away • ⭐⭐⭐⭐½</p>
                              <p className="text-sm text-green-600 mt-2">Highest rated in your area</p>
                            </div>
                            <div 
                              className={`p-4 border rounded-lg cursor-pointer transition ${
                                selectedDealer === 'eco' ? 'bg-green-50 border-green-500' : 'hover:bg-gray-50'
                              }`}
                              onClick={() => handleDealerSelect('eco')}
                            >
                              <p className="font-semibold">EcoWaste Solutions</p>
                              <p className="text-gray-600">2.5 km away • ⭐⭐⭐⭐</p>
                              <p className="text-sm text-blue-600 mt-2">Best price guarantee</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-white shadow-xl p-4 sm:p-6 rounded-2xl">
                        <CardContent>
                          <div className="flex items-center space-x-4 mb-6">
                            <DollarSignIcon className="w-8 sm:w-10 h-8 sm:h-10 text-green-600" />
                            <div>
                              <h2 className="text-lg sm:text-xl font-semibold text-green-800">Transaction Details</h2>
                              <p className="text-sm sm:text-base text-gray-600">Current market rates</p>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div className="p-4 bg-green-50 rounded-lg">
                              <p className="text-lg"><span className="font-semibold">Weight:</span> 2.5 kg</p>
                              <p className="text-lg"><span className="font-semibold">Rate:</span> $0.50/kg</p>
                              <p className="text-lg"><span className="font-semibold">Bonus:</span> +10% for clean waste</p>
                              <div className="mt-4 pt-4 border-t border-green-200">
                                <p className="text-xl font-bold text-green-600">Total: $1.38</p>
                                <p className="text-sm text-green-600">Including clean waste bonus</p>
                              </div>
                            </div>
                            <Button 
                              className="w-full bg-green-600 text-white hover:bg-green-700"
                              onClick={handleSchedulePickup}
                              disabled={!selectedDealer}
                            >
                              Schedule Pickup
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {activeSection === 'confirmation' && (
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <Card className="max-w-2xl mx-auto bg-white shadow-xl p-4 sm:p-6 rounded-2xl">
            <CardContent className="text-center">
              <CheckCircleIcon className="w-16 h-16 text-green-600 mx-auto mb-6" />
              <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-4">Transaction Confirmed!</h2>
              <div className="space-y-4 text-left mb-8">
                <p className="text-gray-600"><span className="font-semibold">Pickup Schedule:</span> Tomorrow, 
                10:00 AM</p>
                <p className="text-gray-600"><span className="font-semibold">Location:</span> Your registered address</p>
                <p className="text-gray-600"><span className="font-semibold">Dealer: </span> {selectedDealer === 'green' ? 'Green Recyclers Ltd.' : 'EcoWaste Solutions'}</p>
                <p className="text-gray-600"><span className="font-semibold">Expected Payment:</span> $1.38</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-green-700">Payment will be processed after waste collection and verification</p>
              </div>
              <Button 
                className="bg-green-600 text-white hover:bg-green-700"
                onClick={() => setActiveSection('home')}
              >
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {activeSection === 'locations' && (
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-green-800 mb-8 sm:mb-12">Collection Centers</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="bg-white shadow-lg hover:shadow-xl transition">
                <CardContent className="p-4 sm:p-6">
                  <MapPinIcon className="w-8 h-8 text-green-600 mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">Collection Center {i}</h3>
                  <p className="text-gray-600 mb-4">123 Green Street, Eco City</p>
                  <p className="text-sm text-gray-500">Operating Hours: 9 AM - 6 PM</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <footer className="eco-gradient text-white py-12 sm:py-16 mt-12 sm:mt-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-4">GenZ Bin</h3>
              <p className="text-green-200">Making recycling smart and rewarding</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-green-200">
                <li>About Us</li>
                <li>How It Works</li>
                <li>Pricing</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-green-200">
                <li>Blog</li>
                <li>Partners</li>
                <li>FAQ</li>
                <li>Support</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-green-200">
                <li>Twitter</li>
                <li>Facebook</li>
                <li>Instagram</li>
                <li>LinkedIn</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-green-700 mt-8 pt-8 text-center text-green-200">
            <p>© 2025 GenZ Bin. Made By Team Binbots.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;