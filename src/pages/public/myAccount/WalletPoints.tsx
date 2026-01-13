import LoaderSpinner from "@/components/loader/LoaderSpinner";
import { useGetUserByIdQuery } from "@/components/store/api/authenticationApi";
import { selectUser } from "@/components/store/store";
import { useSelector } from "react-redux";

const WalletPoints = () => {
    const user = useSelector(selectUser);
    const { id: userId } = user || {};
    const { data, isLoading } = useGetUserByIdQuery(
        userId as string,
        {
            skip: !userId,
        }
    );

    const userData = data?.data;
    const points = userData?.point || 0;
    const withdrawPoints = userData?.withdrawPoint || 0;
    
    // Calculate redeemable amount (1 TK per 10 points)
    const redeemableAmount = Math.floor(points / 10);
    const remainingPoints = points % 10;

    if (isLoading) {
        return <LoaderSpinner />;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8">My Wallet Points</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Available Points Card */}
                <div className="bg-white rounded-lg shadow-lg p-6 h-full">
                    <h2 className="text-lg text-gray-600 mb-2">Available Points</h2>
                    <p className="text-4xl font-bold text-blue-600 mb-4">{points}</p>
                    <div className="border-t border-gray-200 my-4"></div>
                    <p className="text-gray-700 mb-2">
                        You can redeem {redeemableAmount} TK from your points.
                    </p>
                    {remainingPoints > 0 && (
                        <p className="text-sm text-gray-500">
                            You need {10 - remainingPoints} more points to earn an additional 1 TK.
                        </p>
                    )}
                </div>

                {/* Withdrawn Points Card */}
                <div className="bg-white rounded-lg shadow-lg p-6 h-full">
                    <h2 className="text-lg text-gray-600 mb-2">Withdrawn Points</h2>
                    <p className="text-4xl font-bold text-purple-600 mb-4">{withdrawPoints}</p>
                    <div className="border-t border-gray-200 my-4"></div>
                    <p className="text-gray-700">
                        Total points you've withdrawn so far.
                    </p>
                </div>
            </div>

            {/* Redemption Info Section */}
            <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
                <h2 className="text-xl font-bold mb-4">Points Redemption Information</h2>
                <ul className="space-y-3">
                    <li className="flex items-start">
                        <span className="mr-2">💰</span>
                        <span><strong>Conversion Rate:</strong> 10 points = 1 TK</span>
                    </li>
                    <li className="flex items-start">
                        <span className="mr-2">🔄</span>
                        <span><strong>How to redeem:</strong> Points can be redeemed during checkout or transferred to your account.</span>
                    </li>
                    <li className="flex items-start">
                        <span className="mr-2">🎁</span>
                        <span><strong>Earn more points:</strong> Make purchases, refer friends, or participate in promotions to earn additional points.</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default WalletPoints;