import { motion } from "framer-motion";
import { Save, User as UserIcon, Mail, Shield } from "lucide-react";

const Profile = () => {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-[linear-gradient(135deg,#6762f1,#7c4bed,#9035ea)] bg-clip-text text-transparent mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-500">Manage your account information</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="shadow-xl border-none bg-gradient-to-br from-indigo-50 to-purple-50">
            <div className="p-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <UserIcon className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    Vibhuti Sangani
                  </h2>
                  <p className="text-gray-600 mb-2">abc@gmail.com</p>
                  {/* <Badge
                    className={
                      user?.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-100 text-gray-700"
                    }
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    {user?.role === "admin" ? "Administrator" : "User"}
                  </Badge> */}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="shadow-xl border-none bg-white">
            <div className="border-b border-gray-100 p-5 font-semibold">
              <p className="text-2xl">Edit Profile</p>
            </div>
            <div className="p-6">
              <form className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="full_name"
                    className="block text-sm font-medium mb-2"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="full_name"
                      //   value={formData.full_name}
                      //   onChange={(e) =>
                      //     setFormData({ ...formData, full_name: e.target.value })
                      //   }
                      placeholder="Enter your full name"
                      required
                      className="pl-10  w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-[#f9f9fa] text-gray-950 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      //   value={formData.email}
                      //   onChange={(e) =>
                      //     setFormData({ ...formData, email: e.target.value })
                      //   }
                      placeholder="Enter your email"
                      required
                      className="pl-10 w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-[#f9f9fa] text-gray-950 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-[linear-gradient(135deg,#6762f1,#7c4bed,#9035ea)] flex items-center justify-center gap-2 text-sm text-white font-semibold py-2.5 rounded-lg hover:opacity-90 transition"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
