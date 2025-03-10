import React, { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { toast } from 'react-hot-toast';

export default function Fest() {

  const navigate=useNavigate();

  useEffect(() => {
    const banner = document.querySelector('.festival-banner');

    for (let i = 0; i < 8; i++) {
      const led = document.createElement('div');
      led.classList.add('led-effect');

      // Random position
      led.style.left = `${Math.random() * 100}%`;
      led.style.top = `${Math.random() * 100}%`;

      // Random delay and color
      led.style.animationDelay = `${Math.random() * 2}s`;

      const colors = ['#ff0057', '#2196f3', '#ffeb3b', '#4caf50'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      led.style.background = randomColor;
      led.style.boxShadow = `0 0 10px 2px ${randomColor}`;

      banner.appendChild(led);
    }
  }, []);

  const handleDownload = () => {
    window.open("https://www.mitpersonafest.mituniversity.ac.in/wp-content/uploads/2025/03/Persona_Schedule-2048x1448.png", "_blank");
  };
  

  // const handleDownload = async () => {
  //   console.log("handleDownload");
  
  //   const imageUrl = "https://www.mitpersonafest.mituniversity.ac.in/wp-content/uploads/2025/03/Persona_Schedule-2048x1448.png";
    
  //   // Fetch the image as a Blob
  //   const response = await fetch(imageUrl);
  //   const blob = await response.blob();
    
  //   // Create a download link and force download
  //   const url = URL.createObjectURL(blob);
  //   const link = document.createElement('a');
  //   link.href = url;
  //   link.download = 'Persona_Schedule.png';
  //   link.click();
    
  //   // Clean up the object URL
  //   URL.revokeObjectURL(url);
  // };
  

  const handleShare = (e) => {
    // console.log("handleShare");
    // e.preventDefault();
    // alert('Sharing to FriendsBook... Thanks for spreading the word!');
    // navigate('https://www.friendsbook.online')

      navigator.clipboard.writeText(`https://www.friendsbook.online`)
      .then(() => toast.success("website link copied! Share it to your friends."))
      .catch(err => console.error('Failed to copy:', err));
    
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="festival-banner bg-white shadow-lg border border-gray-300 max-w-2xl mx-auto p-5 relative overflow-hidden">
        <div className="bg-gray-100 border-b border-gray-200 p-1 text-sm font-bold text-gray-800">
          MIT-ADT University presents: PERSONA FEST 2025
        </div>

        <div className="flex flex-col items-center py-5">
          <img
            src="/images/fest.jpg"
            alt="Persona Fest 2025 Logo"
            className=" h-15 max-w-xs mb-3"
          />

          <div className="text-white bg-blue-700 px-4 py-2 rounded-md font-bold text-sm mb-3">
            50+ EVENTS | 3 EPIC DAYS | UNLIMITED FUN!
          </div>

          <div className="flex gap-2">
            {["11 MARCH", "12 MARCH", "13 MARCH"].map((date) => (
              <div
                key={date}
                className="bg-yellow-400 border border-yellow-600 px-3 py-1 rounded-md text-sm font-bold"
              >
                {date}
              </div>
            ))}
          </div>

          <div className="bg-blue-700 text-white text-center font-bold rounded-md py-2 px-4 mt-3">
            🤝 OFFICIAL COLLABORATION WITH FRIENDSBOOK
          </div>

          <p className="text-center text-sm text-gray-600 mt-3 px-4">
            Get ready for the most ELECTRIFYING techno-cultural festival of the year! Level up your
            college experience with mind-blowing competitions, workshops, and performances!
          </p>

          {/* <div className="bg-yellow-100 border border-yellow-500 px-4 py-2 rounded-md mt-4 text-sm font-bold animate-pulse">
            🏆 UNLOCK YOUR POTENTIAL! WIN AMAZING PRIZES! 🏆<br />
            Join 5000+ students in the ULTIMATE college showdown!
          </div> */}

          <div className="bg-yellow-100 border border-yellow-500 px-4 py-2 rounded-md mt-4 text-sm font-bold animate-scale">
            🏆 UNLOCK YOUR POTENTIAL! WIN AMAZING PRIZES! 🏆<br />
            Join 5000+ students in the ULTIMATE college showdown!
          </div>

          <div className="flex gap-3 mt-4 flex-wrap justify-center">
            <button
              onClick={handleShare}
              className="bg-blue-700 text-white px-4 py-2 text-sm font-bold rounded-md"
            >
              SHARE ON FRIENDSBOOK
            </button>
            <button
              onClick={handleDownload}
              className="bg-red-500 text-white px-4 py-2 text-sm font-bold rounded-md"
                       >
              VIEW SCHEDULE
            </button>
            <button
              className="bg-green-600 text-white px-4 py-2 text-sm font-bold rounded-md"
              // onClick={navigate('https://www.friendsbook.online')}
              onClick={handleShare}
            >
              INVITE FRIENDS

            </button>
          </div>
        </div>

        {/* Pop-up Notification */}
        <div className="absolute top-13 right-5 bg-yellow-300 border border-yellow-500 px-3 py-2 rounded-md text-xs font-bold animate-bounce">
          🎮 30+ gaming events added! Don't miss out!
        </div>

        {/* LED Blinking Effect */}
        <style>
          {`
          .led-effect {
            position: absolute;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            box-shadow: 0 0 10px 2px #ff0057;
            animation: blink 1s infinite alternate;
          }

          @keyframes blink {
            0% { opacity: 0.3; }
            100% { opacity: 1; }
          }

          @keyframes scaleUpDown {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.1);
            }
            100% {
              transform: scale(1);
            }
          }
        
          .animate-scale {
            animation: scaleUpDown 1.5s infinite ease-in-out;
          }
          `}

          
        </style>
      </div>
    </div>
  );
}
