import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { apiCall } from "../utils/api";
import {
  FaMapMarkerAlt,
  FaStar,
  FaRegCalendarAlt,
  FaEdit,
  FaTrash,
  FaCamera,
  FaUser,
  FaListAlt,
  FaLevelUpAlt,
  FaInfoCircle,
  FaCoins,
  FaHeart
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { CountUp } from "./CountUp";
const countryStateCityData = {
   India: {
    AndhraPradesh: ["Alluri Sitharama Raju","Anakapalli","Ananthapuramu","Annamayya","Bapatla","Chittoor","Dr. B. R. Ambedkar Konaseema","East Godavari","Eluru","Guntur","Kadapa (YSR Kadapa)","Kakinada","Konaseema","Krishna","Kurnool","Nandyal","NTR District","Palnadu","Parvathipuram Manyam","Prakasam","Sri Potti Sriramulu Nellore","Sri Sathya Sai","Srikakulam","Tirupati","Visakhapatnam","Vizianagaram","West Godavari"],
    Telangana: ["Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagitial", "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam", "Komaram Bheem Asifabad", "Mahabubabad", "Mahabubnagar", "Mancherial", "Medchal–Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Rangareddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal", "Yadadri Bhuvanagiri"],
    Rajasthan: ["Ajmer", "Alwar", "Balotra", "Banswara", "Baran", "Barmer", "Beawar", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Deeg", "Dholpur", "Didwana-Kuchaman", "Dungarpur", "Hanumangarh", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Karauli", "Kekri", "Kekri", "Kishangarh", "Kota", "Nagaur", "Pali", "Pratapgarh", "Rajsamand", "Sawai Madhopur", "Sikar", "Sirohi", "Sri Ganganagar", "Tonk", "Udaipur"],
    UttarPradesh: ["Agra","Aligarh","Ambedkar Nagar","Amethi","Amroha","Auraiya","Ayodhya","Azamgarh","Baghpat","Bahraich","Ballia","Balrampur","Banda","Barabanki","Bareilly","Basti","Bijnor","Budaun","Bulandshahr","Chandauli","Chitrakoot","Deoria","Etah","Etawah","Farrukhabad","Fatehpur","Firozabad","Gautam Buddha Nagar","Ghaziabad","Ghazipur","Gonda","Gorakhpur","Hamirpur","Hapur","Hardoi","Hathras","Jalaun","Jaunpur","Jhansi","Kannauj","Kanpur Dehat","Kanpur Nagar","Kasganj","Kaushambi","Kushinagar","Lakhimpur Kheri","Lalitpur","Lucknow","Maharajganj","Mahoba","Mainpuri","Mathura","Mau","Meerut","Mirzapur","Moradabad","Muzaffarnagar","Pilibhit","Pratapgarh","Rae Bareli","Rampur","Saharanpur","Sambhal","Sant Kabir Nagar","Shahjahanpur","Shamli","Shravasti","Siddharthnagar","Sitapur","Sonbhadra","Sultanpur","Unnao","Varanasi"],
    Maharashtra: ["Ahmednagar","Akola","Amravati","Aurangabad","Beed","Bhandara","Buldhana","Chandrapur","Dhule","Gadchiroli","Gondia","Hingoli","Jalgaon","Jalna","Kolhapur","Latur","Mumbai City","Mumbai Suburban","Nagpur","Nanded","Nandurbar","Nashik","Osmanabad","Palghar","Parbhani","Pune","Raigad","Ratnagiri","Sangli","Satara","Sindhudurg","Solapur","Thane","Wardha","Washim","Yavatmal"],
    Bihar: ["Araria","Arwal","Aurangabad","Banka","Begusarai","Bhagalpur","Bhojpur","Buxar","Darbhanga","Gaya","Gopalganj","Jamui","Jehanabad","Kaimur","Katihar","Khagaria","Kishanganj","Lakhisarai","Madhepura","Madhubani","Munger","Muzaffarpur","Nalanda","Nawada","Patna","Purnia","Rohtas","Saharsa","Samastipur","Saran","Sheikhpura","Sheohar","Sitamarhi","Siwan","Supaul","Vaishali","West Champaran"],
    WestBengal: ["Alipurduar","Bankura","Birbhum","Cooch Behar","Dakshin Dinajpur","Darjeeling","Hooghly","Howrah","Jalpaiguri","Jhargram","Kalimpong","Kolkata","Malda","Murshidabad","Nadia","North 24 Parganas","Paschim Bardhaman","Paschim Medinipur","Purba Bardhaman","Purba Medinipur","Purulia","South 24 Parganas","Uttar Dinajpur"],
    Karnataka: ["Bagalkot","Bangalore Rural","Bangalore Urban","Belagavi","Bengaluru","Ballari","Bidar","Chamarajanagar","Chikballapur","Chikkamagaluru","Chitradurga","Dakshina Kannada","Davangere","Dharwad","Gadag","Hassan","Haveri","Kalaburagi","Kodagu","Kolar","Koppal","Mandya","Mysuru","Raichur","Ramanagara","Shivamogga","Tumakuru","Udupi","Uttara Kannada","Vijayapura","Yadgir"],
    TamilNadu: ["Ariyalur","Chengalpattu","Chennai","Coimbatore","Cuddalore","Dharmapuri","Dindigul","Erode","Kallakurichi","Kancheepuram","Karur","Krishnagiri","Madurai","Nagapattinam","Namakkal","Nilgiris","Perambalur","Pudukottai","Ramanathapuram","Ranipet","Salem","Sivaganga","Tenkasi","Thanjavur","Theni","Thoothukudi","Tiruchirappalli","Tirunelveli","Tirupathur","Tiruppur","Tiruvallur","Tiruvarur","Vellore","Viluppuram","Virudhunagar"],
    Kerala: ["Alappuzha","Ernakulam","Idukki","Kannur","Kasaragod","Kollam","Kottayam","Kozhikode","Malappuram","Palakkad","Pathanamthitta","Thiruvananthapuram","Thrissur","Wayanad"],
    Odisha: ["Angul","Balangir","Balasore","Bargarh","Bhadrak","Boudh","Cuttack","Deogarh","Dhenkanal","Gajapati","Ganjam","Jagatsinghpur","Jajpur","Jharsuguda","Kalahandi","Kandhamal","Kendrapara","Kendujhar","Khordha","Koraput","Malkangiri","Mayurbhanj","Nabarangpur","Nuapada","Puri","Rayagada","Sambalpur","Sonepur","Sundargarh"],
    Haryana: ["Ambala","Bhiwani","Charkhi Dadri","Faridabad","Fatehabad","Gurugram","Hisar","Jhajjar","Jind","Kaithal","Karnal","Kurukshetra","Mahendragarh","Nuh","Palwal","Panchkula","Panipat","Rewari","Rohtak","Sirsa","Sonipat","Yamunanagar"],
    HimachalPradesh: ["Bilaspur","Chamba","Hamirpur","Kangra","Kinnaur","Kullu","Lahul and Spiti","Mandi","Shimla","Sirmaur","Solan","Una"],
    Jharkhand: ["Bokaro","Chatra","Deoghar","Dhanbad","Dumka","East Singhbhum","Garhwa","Giridih","Godda","Gumla","Hazaribagh","Jamtara","Khunti","Koderma","Latehar","Lohardaga","Pakur","Palamu","Ramgarh","Ranchi","Sahibganj","Seraikela Kharsawan","Simdega","West Singhbhum"],
    Goa: ["North Goa","South Goa"],
    Gujarat: ["Ahmedabad","Amreli","Anand","Aravalli","Banaskantha","Bharuch","Bhavnagar","Botad","Chhota Udaipur","Dahod","Dang","Devbhoomi Dwarka","Gandhinagar","Gir Somnath","Jamnagar","Junagadh","Kheda","Kutch","Mahisagar","Mehsana","Morbi","Narmada","Navsari","Patan","Panchmahal","Porbandar","Rajkot","Sabarkantha","Surat","Surendranagar","Tapi","Vadodara","Valsad"],
    MadhyaPradesh: ["Agar Malwa","Alirajpur","Anuppur","Ashoknagar","Balaghat","Barwani","Betul","Bhind","Bhopal","Burhanpur","Chhatarpur","Chhindwara","Damoh","Datia","Dewas","Dhar","Dindori","Guna","Gwalior","Harda","Hoshangabad","Indore","Jabalpur","Jhabua","Katni","Khandwa","Khargone","Mandla","Mandsaur","Morena","Narsinghpur","Neemuch","Panna","Raisen","Rajgarh","Ratlam","Rewa","Sagar","Satna","Sehore","Seoni","Shahdol","Shajapur","Sheopur","Shivpuri","Sidhi","Singrauli","Tikamgarh","Ujjain","Umaria","Vidisha"],
    Chhattisgarh: ["Balod","Baloda Bazar","Balrampur","Bastar","Bemetara","Bijapur","Bilaspur","Dantewada","Dhamtari","Durg","Gariaband","Janjgir-Champa","Jashpur","Kabirdham","Kanker","Kondagaon","Korba","Korea","Mahasamund","Mungeli","Narayanpur","Raigarh","Raipur","Rajnandgaon","Sukma","Surajpur","Surguja"],
    Assam: ["Baksa","Barpeta","Bongaigaon","Cachar","Charaideo","Chirang","Darrang","Dhemaji","Dhubri","Dibrugarh","Dima Hasao","Goalpara","Golaghat","Hailakandi","Hojai","Jorhat","Kamrup Metropolitan","Kamrup","Karbi Anglong","Karimganj","Kokrajhar","Lakhimpur","Majuli","Morigaon","Nagaon","Nalbari","Sivasagar","Sonitpur","South Salmara-Mankachar","Tinsukia","Udalguri","West Karbi Anglong"],
    ArunachalPradesh: ["Anjaw","Changlang","Dibang Valley","East Kameng","East Siang","Kamle","Kra Daadi","Kurung Kumey","Lohit","Longding","Lower Dibang Valley","Lower Siang","Lower Subansiri","Namsai","Papum Pare","Pakke-Kessang","Shi Yomi","Siang","Tawang","Tirap","Upper Siang","Upper Subansiri","West Kameng","West Siang"],
    Nagaland: ["Dimapur","Kiphire","Kohima","Longleng","Mokokchung","Mon","Peren","Phek","Tuensang","Wokha","Zunheboto"],
    Manipur: ["Bishnupur","Chandel","Churachandpur","Imphal East","Imphal West","Jiribam","Kakching","Kamjong","Kangpokpi","Noney","Pherzawl","Senapati","Tamenglong","Tengnoupal","Thoubal","Ukhrul"],
    Mizoram: ["Aizawl","Champhai","Kolasib","Lawngtlai","Lunglei","Mamit","Saiha","Serchhip"],
    Tripura: ["Dhalai","Gomati","Khowai","North Tripura","Sepahijala","South Tripura","Unakoti","West Tripura"],
    Meghalaya: ["East Garo Hills","East Jaintia Hills","East Khasi Hills","North Garo Hills","Ri Bhoi","South Garo Hills","South West Garo Hills","South West Khasi Hills","West Garo Hills","West Jaintia Hills","West Khasi Hills"],
    Sikkim: ["East Sikkim","North Sikkim","South Sikkim","West Sikkim"],
    Delhi: ["Central Delhi","East Delhi","New Delhi","North Delhi","North East Delhi","North West Delhi","Shahdara","South Delhi","South East Delhi","South West Delhi","West Delhi"],
    Puducherry: ["Karaikal","Mahe","Puducherry","Yanam"],
    JammuKashmir: ["Anantnag","Bandipora","Baramulla","Budgam","Doda","Ganderbal","Jammu","Kargil","Kathua","Kishtwar","Kulgam","Kupwara","Leh","Poonch","Pulwama","Rajouri","Ramban","Reasi","Samba","Shopian","Srinagar","Udhampur"]
  },
  USA: {
    California: ["Los Angeles", "San Francisco", "San Diego"],
    Texas: ["Houston", "Dallas", "Austin"],
    Alabama: ["Autauga","Baldwin","Barbour","Bibb","Blount","Bullock","Butler","Calhoun","Chambers","Cherokee","Chilton","Choctaw","Clarke","Clay","Cleburne","Coffee","Colbert","Conecuh","Coosa","Covington","Crenshaw","Cullman","Dale","Dallas","DeKalb","Elmore","Escambia","Etowah","Fayette","Franklin","Geneva","Greene","Hale","Henry","Houston","Jackson","Jefferson","Lamar","Lauderdale","Lawrence","Lee","Limestone","Lowndes","Macon","Madison","Marengo","Marion","Marshall","Mobile","Monroe","Montgomery","Morgan","Perry","Pickens","Pike","Randolph","Russell","St. Clair","Shelby","Sumter","Talladega","Tallapoosa","Tuscaloosa","Walker","Washington","Wilcox","Winston"],
    Alaska: ["Aleutians East","Aleutians West","Anchorage","Bethel","Bristol Bay","Denali","Dillingham","Fairbanks North Star","Haines","Juneau","Kenai Peninsula","Ketchikan Gateway","Kodiak Island","Lake and Peninsula","Matanuska-Susitna","Nome","North Slope","Northwest Arctic","Petersburg","Prince of Wales-Hyder","Sitka","Skagway","Southeast Fairbanks","Valdez-Cordova","Wade Hampton","Wrangell","Yakutat","Yukon-Koyukuk"],
    Arizona: ["Apache","Cochise","Coconino","Gila","Graham","Greenlee","La Paz","Maricopa","Mohave","Navajo","Pima","Pinal","Santa Cruz","Yavapai","Yuma"],
    Florida: ["Miami-Dade","Broward","Palm Beach","Hillsborough","Orange","Pinellas","Duval","Lee","Polk","Brevard"],
    NewYork: ["New York","Kings","Queens","Bronx","Richmond","Suffolk","Nassau","Westchester","Erie","Monroe"],
    Illinois: ["Cook","DuPage","Lake","Will","Kane","McHenry","Winnebago","St. Clair","Peoria","Madison"],
    Pennsylvania: ["Philadelphia","Allegheny","Montgomery","Bucks","Delaware","Lancaster","Chester","Berks","Westmoreland","Lehigh"],
    Ohio: ["Cuyahoga","Franklin","Hamilton","Summit","Montgomery","Stark","Lucas","Mahoning","Butler","Lorain"],
    Georgia: ["Fulton","Gwinnett","Cobb","DeKalb","Clayton","Cherokee","Henry","Forsyth","Hall","Bulloch"],
    Michigan: ["Wayne","Oakland","Macomb","Kent","Genesee","Washtenaw","Ingham","Ottawa","Saginaw","St. Clair"],
    NorthCarolina: ["Mecklenburg","Wake","Guilford","Forsyth","Cumberland","Durham","Buncombe","Union","Johnston","New Hanover"],

  },
  Australia: {
    Queensland: ["Brisbane", "Gold Coast", "Cairns"],
    Victoria: ["Melbourne", "Geelong", "Ballarat"],
    NewSouthWales: ["Sydney","Newcastle","Wollongong","Central Coast","Coffs Harbour","Tamworth","Dubbo","Orange","Wagga Wagga","Albury"],
    WesternAustralia: ["Perth","Bunbury","Geraldton","Kalgoorlie","Albany","Broome","Karratha","Mandurah","Busselton","Port Hedland"],
    SouthAustralia: ["Adelaide","Mount Gambier","Whyalla","Gawler","Port Lincoln","Port Pirie","Murray Bridge","Port Augusta","Victor Harbor","Barossa"],
    Tasmania: ["Hobart","Launceston","Devonport","Burnie","Kingston","Glenorchy","Clarence","Devonport","Burnie","Launceston"],
    NorthernTerritory: ["Darwin","Alice Springs","Tennant Creek","Katherine","Nhulunbuy","Palmerston","Yulara"],
    AustralianCapitalTerritory: ["Canberra","Belconnen","Gungahlin","Tuggeranong","Woden Valley","Weston Creek","Molonglo Valley"],

  },
  Canada: {
    BritishColumbia: ["Vancouver","Victoria","Surrey","Burnaby","Kelowna","Richmond","Abbotsford","Coquitlam","Langley","Saanich"],
    Ontario: ["Toronto","Ottawa","Mississauga","Brampton","Hamilton","London","Markham","Vaughan","Kitchener","Windsor"],
    Quebec: ["Montreal","Quebec City","Laval","Gatineau","Longueuil","Sherbrooke","Saguenay","Trois-Rivières","Terrebonne","Lévis"],
    Alberta: ["Calgary","Edmonton","Red Deer","Lethbridge","St. Albert","Grande Prairie","Medicine Hat","Airdrie","Spruce Grove","Fort McMurray"],
    Manitoba: ["Winnipeg","Brandon","Steinbach","Thompson","Portage la Prairie","Selkirk","Morden","Winkler","Dauphin","Flin Flon"],
    Saskatchewan: ["Saskatoon","Regina","Prince Albert","Moose Jaw","Swift Current","Yorkton","Estevan","Warman","Martensville","Lloydminster"],
    NovaScotia: ["Halifax","Sydney","Truro","New Glasgow","Kentville","Amherst","Dartmouth","Glace Bay","Bridgewater","Yarmouth"],
    NewBrunswick: ["Moncton","Saint John","Fredericton","Miramichi","Bathurst","Campbellton","Edmundston","Dieppe","Riverview","Caraquet"],
    NewfoundlandandLabrador: ["St. John's","Corner Brook","Gander","Grand Falls-Windsor","Happy Valley-Goose Bay","Mount Pearl","Bonavista","Placentia","Carbonear","Lewisporte"],
    PrinceEdwardIsland: ["Charlottetown","Summerside","Montague","Souris","Cornwall","Borden-Carleton","Georgetown","Kingsboro","Morell","St. Peters Bay"],
    NorthwestTerritories: ["Yellowknife","Inuvik","Hay River","Fort Smith","Behchoko","Fort Simpson","Norman Wells","Tuktoyaktuk","Fort Good Hope","Aklavik"],
    Yukon: ["Whitehorse","Dawson City","Watson Lake","Haines Junction","Carmacks","Creston","Teslin","Burwash Landing","Old Crow","Beaver Creek"],
    Nunavut: ["Iqaluit","Rankin Inlet","Arviat","Cambridge Bay","Baker Lake","Pangnirtung","Pond Inlet","Igloolik","Gjoa Haven","Cape Dorset"],

  },
  UK: {
    England: ["Greater London","Greater Manchester","West Midlands","Merseyside","West Yorkshire","Hampshire","Kent","Essex","Lancashire","Surrey"], 
    Scotland: ["Aberdeen City","Aberdeenshire","Angus","Argyll and Bute","City of Edinburgh","Clackmannanshire","Dumfries and Galloway","Dundee City","East Ayrshire","East Dunbartonshire"], 
    Wales: ["Blaenau Gwent","Bridgend","Caerphilly","Cardiff","Carmarthenshire","Ceredigion","Conwy","Denbighshire","Flintshire","Gwynedd"], 
    NorthernIreland: ["Antrim","Armagh","Down","Fermanagh","Londonderry","Tyrone"]

  }
};
function Profile() {
  const [skills, setSkills] = useState([]);
  const [interests, setInterests] = useState([]);
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [showInterestForm, setShowInterestForm] = useState(false);
  const [showEditProfileForm, setShowEditProfileForm] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    location: "",
    bio: "",
    image: "download.jpg",
    rating: 4.9,
    sessions: 47,
    credits: 85
  });
  const [newSkill, setNewSkill] = useState({
    title: "",
    category: "",
    level: "",
    description: "",
    credits: ""
  });
  const [newInterest, setNewInterest] = useState("");
  const [editProfile, setEditProfile] = useState(profile);
  const [imageFile, setImageFile] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem("skillSwapToken");
    if (!token) {
      console.warn("No auth token found. Please log in.");
      Swal.fire({
        title: 'Login Required',
        text: 'Please log in to view your profile',
        icon: 'warning',
        confirmButtonText: 'Go to Login',
        confirmButtonColor: '#3085d6',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        } else {
          navigate('/');
        }
      });
      return;
    }
    const fetchProfile = async () => {
      try {
        const data = await apiCall('/profile/me');
        setSkills(data.skills || []);
        setInterests(data.interests || []);
        const toAbs = (img) => {
          if (!img) return "download.jpg";
          if (img.startsWith("http://") || img.startsWith("https://")) return img;
          if (img.startsWith("/uploads/")) return `${import.meta.env.VITE_API_URL}${img}`;
          return img;
        };
        const baseProfile = {
          name: data.name || "",
          location: data.location || "",
          bio: data.bio || "",
          image: toAbs(data.image) || "download.jpg",
          rating: data.rating ?? 4.9,
          sessions: data.sessions ?? 47,
          credits: data.credits ?? 85,
        };
        setProfile(baseProfile);
        setEditProfile(baseProfile);
      } catch (e) {
        console.error(e);
      }
    };
    fetchProfile();
  }, []);
  const handleAddSkill = async () => {
    if (
      newSkill.title &&
      newSkill.category &&
      newSkill.level &&
      newSkill.description &&
      newSkill.credits
    ) {
      try {
        const data = await apiCall('/profile/skills', {
          method: 'POST',
          body: JSON.stringify(newSkill)
        });
        setSkills([...skills, { ...newSkill, _id: data._id || Date.now().toString() }]);
        setNewSkill({
          title: "",
          category: "",
          level: "",
          description: "",
          credits: "",
        });
        setShowSkillForm(false);
      } catch (error) {
        console.error("Error adding skill:", error);
        Swal.fire('Error', 'Failed to add skill', 'error');
      }
    }
  };
  const handleAddInterest = async () => {
    if (newInterest.trim()) {
      try {
        const data = await apiCall('/profile/interests', {
          method: 'POST',
          body: JSON.stringify({ interest: newInterest })
        });
        setInterests([...interests, newInterest.trim()]);
        setNewInterest("");
        setShowInterestForm(false);
      } catch (error) {
        console.error("Error adding interest:", error);
        Swal.fire('Error', 'Failed to add interest', 'error');
      }
    }
  };
  const handleDeleteSkill = async (id) => {
    try {
      await apiCall(`/profile/skills/${id}`, {
        method: 'DELETE'
      });
      setSkills(skills.filter((skill) => skill._id !== id));
    } catch (error) {
      console.error("Error deleting skill:", error);
      Swal.fire('Error', 'Failed to delete skill', 'error');
    }
  };
  const handleDeleteInterest = async (interest) => {
    try {
      await apiCall('/profile/interests', {
        method: 'DELETE',
        body: JSON.stringify({ interest })
      });
      setInterests(interests.filter((i) => i !== interest));
    } catch (error) {
      console.error("Error deleting interest:", error);
      Swal.fire('Error', 'Failed to delete interest', 'error');
    }
  };
  const handleSaveProfile = async () => {
    const locationString =
      selectedCountry && selectedState && selectedCity
        ? `${selectedCity}, ${selectedState}, ${selectedCountry}`
        : editProfile.location;

    try {
      const formData = new FormData();
      if (imageFile) {
        formData.append("image", imageFile);
      }
      formData.append("name", editProfile.name);
      formData.append("location", locationString);
      formData.append("bio", editProfile.bio);

      const data = await apiCall('/profile', {
        method: 'PUT',
        body: formData,
        headers: {}
      });

      setProfile({
        ...profile,
        ...data,
        image: data.image || profile.image,
      });
      setShowEditProfileForm(false);
      setImageFile(null);
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire('Error', 'Failed to update profile', 'error');
    }
  };
  const handleImageChange = (e) => {
    const file = e.target && e.target.files && e.target.files[0];
    setImageFile(file || null);
  };
  const handleUploadImage = async () => {
    if (!imageFile) return;
    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const data = await apiCall('/profile/image', {
        method: 'POST',
        body: formData,
        headers: {}
      });

      const imgUrl = data?.image?.startsWith("/uploads/")
        ? `${import.meta.env.VITE_API_URL}${data.image}`
        : data?.image || profile.image;
      setProfile((prev) => ({ ...prev, image: imgUrl }));
      setEditProfile((prev) => ({ ...prev, image: imgUrl }));
      setImageFile(null);
    } catch (error) {
      console.error("Error uploading image:", error);
      Swal.fire('Error', 'Failed to upload image', 'error');
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-50 to-blue-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-6">
            <img
              src={profile.image}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold">{profile.name}</h2>
              <div className="flex items-center text-gray-600 text-sm space-x-4 mt-1">
                <span className="flex items-center gap-1">
                  <FaMapMarkerAlt className="text-gray-400" />{" "}
                  {profile.location || "No location set"}
                </span>
                <span className="flex items-center gap-1">
                  <FaStar className="text-yellow-400" />
                  <CountUp
                    value={profile.rating}
                    decimals={1}
                    suffix=" rating"
                    duration={1.5}
                  />
                </span>
                <span className="flex items-center gap-1">
                  <FaRegCalendarAlt className="text-gray-400" />
                  <CountUp
                    value={profile.sessions}
                    suffix=" sessions"
                    duration={2}
                  />
                </span>
              </div>
              <p className="mt-2 text-gray-600 text-sm max-w-lg">
                {profile.bio || "No bio added yet"}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end mt-4 md:mt-0">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-500 rounded-lg hover:bg-orange-100"
              onClick={() => setShowEditProfileForm(true)}
            >
              <FaEdit /> Edit Profile
            </button>
            <div className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-full font-semibold">
              <CountUp
                value={profile.credits}
                suffix=" Credits Available"
                duration={2}
              />
            </div>
          </div>
        </div>
<div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Skills I Teach</h3>
              <button
                onClick={() => setShowSkillForm(true)}
                className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 text-sm"
              >
                + Add Skill
              </button>
            </div>
            <div className="space-y-4">
              {skills.map((skill) => (
                <div key={skill._id || skill.title} className="border rounded-lg p-4">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-semibold">{skill.title}</h4>
                      <div className="flex gap-2 mt-1">
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                          {skill.category}
                        </span>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded">
                          {skill.level}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{skill.description}</p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <span className="text-orange-500 font-medium text-sm">
                        {skill.credits} credits/hr
                      </span>
                      <div className="flex gap-2 text-gray-400 mt-2">
                        <FaTrash
                          className="cursor-pointer hover:text-red-500"
                          onClick={() => handleDeleteSkill(skill._id)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Want to Learn</h3>
              <button
                onClick={() => setShowInterestForm(true)}
                className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm"
              >
                + Add Interest
              </button>
            </div>
            <div className="space-y-3">
              {interests.map((interest, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border rounded-lg p-3 hover:bg-gray-50"
                >
                  <span>{interest}</span>
                  <FaTrash
                    className="text-gray-400 cursor-pointer hover:text-red-500"
                    onClick={() => handleDeleteInterest(interest)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
              {showSkillForm && (
                <motion.div
                  className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="bg-white p-6 rounded-lg w-200 h-100 shadow-lg"
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                  >
                    <h3 className="text-lg font-bold mb-4">Add New Skill</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <FaUser className="text-gray-500" />
                      <input
                        type="text"
                        placeholder="Skill Title"
                        value={newSkill.title}
                        onChange={(e) =>
                          setNewSkill({ ...newSkill, title: e.target.value })
                        }
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <FaListAlt className="text-gray-500" />
                      <input
                        type="text"
                        placeholder="Category...Web Technology,AI Agents....etc"
                        value={newSkill.category}
                        onChange={(e) =>
                          setNewSkill({ ...newSkill, category: e.target.value })
                        }
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <FaLevelUpAlt className="text-gray-500" />
                      <input
                        type="text"
                        placeholder="Level...Beginner,Intermediate,Advanced..."
                        value={newSkill.level}
                        onChange={(e) =>
                          setNewSkill({ ...newSkill, level: e.target.value })
                        }
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <FaInfoCircle className="text-gray-500" />
                      <textarea
                        placeholder="Description"
                        value={newSkill.description}
                        onChange={(e) =>
                          setNewSkill({ ...newSkill, description: e.target.value })
                        }
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <FaCoins className="text-gray-500" />
                      <input
                        type="number"
                        placeholder="Credits per Hour"
                        value={newSkill.credits}
                        onChange={(e) =>
                          setNewSkill({ ...newSkill, credits: e.target.value })
                        }
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setShowSkillForm(false)}
                        className="px-4 py-2 bg-gray-200 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddSkill}
                        className="px-4 py-2 bg-green-500 text-white rounded"
                      >
                        Add
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {showInterestForm && (
                <motion.div
                  className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="bg-white p-6 rounded-lg w-96 shadow-lg"
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                  >
                    <h3 className="text-lg font-bold mb-4">Add New Interest</h3>
                    <div className="flex items-center gap-2 mb-4">
                      <FaHeart className="text-gray-500" />
                      <input
                        type="text"
                        placeholder="Interest"
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setShowInterestForm(false)}
                        className="px-4 py-2 bg-gray-200 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddInterest}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                      >
                        Add
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
      <AnimatePresence>
        {showEditProfileForm && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg w-96 shadow-lg"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <h3 className="text-lg font-bold mb-4">Edit Profile</h3>
              <div className="flex items-center gap-2 mb-2">
                <FaUser className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Name"
                  value={editProfile.name}
                  onChange={(e) =>
                    setEditProfile({ ...editProfile, name: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <FaMapMarkerAlt className="text-gray-500" />
                <select
                  value={selectedCountry}
                  onChange={(e) => {
                    setSelectedCountry(e.target.value);
                    setSelectedState("");
                    setSelectedCity("");
                  }}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Country</option>
                  {Object.keys(countryStateCityData).map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
              {selectedCountry && (
                <div className="flex items-center gap-2 mb-2">
                  <FaMapMarkerAlt className="text-gray-500" />
                  <select
                    value={selectedState}
                    onChange={(e) => {
                      setSelectedState(e.target.value);
                      setSelectedCity("");
                    }}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select State</option>
                    {Object.keys(countryStateCityData[selectedCountry]).map(
                      (state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      )
                    )}
                  </select>
                </div>
              )}
              {selectedState && (
                <div className="flex items-center gap-2 mb-2">
                  <FaMapMarkerAlt className="text-gray-500" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select City</option>
                    {countryStateCityData[selectedCountry][selectedState].map(
                      (city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      )
                    )}
                  </select>
                </div>
              )}
              <div className="flex items-center gap-2 mb-2">
                <FaInfoCircle className="text-gray-500" />
                <textarea
                  placeholder="Bio"
                  value={editProfile.bio}
                  onChange={(e) =>
                    setEditProfile({ ...editProfile, bio: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <FaCamera className="text-gray-500" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleUploadImage}
                    disabled={!imageFile}
                    className={`px-4 py-2 rounded text-white ${imageFile ? "bg-green-600 hover:bg-green-700" : "bg-gray-300 cursor-not-allowed"}`}
                  >
                    Upload Photo
                  </button>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowEditProfileForm(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="px-4 py-2 bg-orange-500 text-white rounded"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default Profile;
