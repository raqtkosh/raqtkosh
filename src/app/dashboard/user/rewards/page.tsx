'use client';

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  category: string;
  image: string;
}

interface UserReward {
  id: string;
  reward: Reward;
  redeemedAt: string;
  isUsed: boolean;
}

interface CartItem extends Reward {
  quantity: number;
}

export default function RewardDashboard() {
  const { user } = useUser();
  const [userData, setUserData] = useState({
    points: 0,
    rewards: [] as UserReward[]
  });
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('tshirts');

  const rewardsData: Reward[] = [
    {
      id: '1',
      name: 'Blood Donor T-Shirt (Red)',
      description: 'Premium quality cotton t-shirt for blood donors',
      pointsCost: 500,
      category: 'tshirts',
      image: '/images/tshirt.jpg'
    },
    {
      id: '2',
      name: 'Blood Donor T-Shirt (White)',
      description: 'Premium quality cotton t-shirt for blood donors',
      pointsCost: 500,
      category: 'tshirts',
      image: '/images/whitetshirt.jpg'
    },
    {
      id: '3',
      name: 'Stainless Steel Water Bottle',
      description: 'Keep your drinks cold or hot with this premium bottle',
      pointsCost: 300,
      category: 'bottles',
      image: '/images/bottle.jpg'
    },
    {
      id: '4',
      name: 'Donor Notebook',
      description: 'Premium notebook for your thoughts and appointments',
      pointsCost: 200,
      category: 'notebooks',
      image: '/images/diary.jpg'
    },
    {
      id: '5',
      name: 'Donor Pen Set',
      description: 'Elegant pen set for your writing needs',
      pointsCost: 150,
      category: 'notebooks',
      image: '/images/pen.jpg'
    },
    {
      id: '6',
      name: 'Donor Hoodie',
      description: 'Comfortable hoodie for cool days',
      pointsCost: 800,
      category: 'tshirts',
      image: '/images/hoddie.jpg'
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      try {
        // Simulate API call
        setTimeout(() => {
          setUserData({
            points: 550, // Only using the value from DB
            rewards: []
          });
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const addToCart = (reward: Reward) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === reward.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === reward.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...prevCart, { ...reward, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (rewardId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== rewardId));
  };

  const updateQuantity = (rewardId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(rewardId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === rewardId ? { ...item, quantity } : item
      )
    );
  };

  const cartTotalPoints = cart.reduce(
    (total, item) => total + (item.pointsCost * item.quantity),
    0
  );

  const canCheckout = cart.length > 0 && userData.points >= cartTotalPoints;

  const checkout = async () => {
    try {
      console.log('Checking out:', cart);
      alert(`Successfully redeemed items for ${cartTotalPoints} points!`);

      setUserData(prev => ({
        ...prev,
        points: prev.points - cartTotalPoints,
        rewards: [
          ...prev.rewards,
          ...cart.map(item => ({
            id: `new-${Date.now()}-${item.id}`,
            reward: item,
            redeemedAt: new Date().toISOString(),
            isUsed: false
          }))
        ]
      }));

      setCart([]);
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Failed to complete checkout. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const filteredRewards = rewardsData.filter(
    reward => reward.category === activeCategory
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      {/* Points Summary */}
      <section className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rewards</h2>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center">
            <p className="text-5xl font-bold text-red-600">{userData.points}</p>
            <p className="text-gray-900">Points (₹{userData.points})</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">Cart Total: {cartTotalPoints} points</p>
            <p className="text-sm text-gray-600">
              {canCheckout ? 'You can checkout!' : 'Add more items or earn more points'}
            </p>
          </div>
        </div>
      </section>

      {/* Reward Categories */}
      <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
        {['tshirts', 'bottles', 'notebooks'].map(category => (
          <Button
            key={category}
            variant={activeCategory === category ? 'default' : 'outline'}
            onClick={() => setActiveCategory(category)}
            className="whitespace-nowrap text-black"
          >
            {category === 'tshirts' ? 'T-Shirts' : category === 'bottles' ? 'Bottles' : 'Notebooks & Pens'}
          </Button>
        ))}
      </div>

      {/* Available Rewards */}
      <section className="mb-12">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Available Rewards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRewards.map(reward => {
            const inCart = cart.find(item => item.id === reward.id);
            const canAdd = userData.points >= reward.pointsCost;

            return (
              <div key={reward.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <div className="bg-gray-100 h-48 flex items-center justify-center">
                  <img 
                    src={reward.image} 
                    alt={reward.name}
                    className="object-cover h-full w-full"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-gray-900">{reward.name}</h4>
                  <p className="text-gray-600 text-sm my-2">{reward.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="font-medium text-gray-900">
                      {reward.pointsCost} points (₹{reward.pointsCost})
                    </span>
                    {inCart ? (
                      <div className="flex items-center gap-2">
                        <Button size="sm" onClick={() => updateQuantity(reward.id, inCart.quantity - 1)} variant="outline">-</Button>
                        <span>{inCart.quantity}</span>
                        <Button size="sm" onClick={() => updateQuantity(reward.id, inCart.quantity + 1)} variant="outline" disabled={!canAdd}>+</Button>
                      </div>
                    ) : (
                      <Button onClick={() => addToCart(reward)} disabled={!canAdd} className="bg-red-600 hover:bg-red-700 text-black" size="sm">
                        Add to Cart
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Cart Section */}
      {cart.length > 0 && (
        <section className="mb-12 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Cart</h3>
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center border-b pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
                    <img src={item.image} alt={item.name} className="object-cover h-full w-full" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.pointsCost} points × {item.quantity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-medium">
                    {item.pointsCost * item.quantity} points
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => removeFromCart(item.id)}>Remove</Button>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center pt-4">
              <h4 className="text-lg font-bold">Total</h4>
              <div className="text-right">
                <p className="text-lg font-bold">{cartTotalPoints} points</p>
                <p className="text-sm text-gray-600">
                  {userData.points >= cartTotalPoints 
                    ? `You'll have ${userData.points - cartTotalPoints} points remaining`
                    : `You need ${cartTotalPoints - userData.points} more points`}
                </p>
              </div>
            </div>
            <Button 
              onClick={checkout}
              disabled={!canCheckout}
              className="w-full bg-red-600 hover:bg-red-700 text-black"
              size="lg"
            >
              Redeem Now
            </Button>
          </div>
        </section>
      )}

      {/* Redeemed Rewards */}
      <section>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Redeemed Rewards</h3>
        {userData.rewards.length > 0 ? (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reward</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userData.rewards.map(userReward => (
                  <tr key={userReward.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {userReward.reward.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(userReward.redeemedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        userReward.isUsed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {userReward.isUsed ? 'Used' : 'Unused'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">You haven't redeemed any rewards yet.</p>
        )}
      </section>
    </div>
  );
}
