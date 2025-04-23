import Link from "next/link";

export default function AboutPage() {
  // Team members data
  const teamMembers = [
    {
      name: "Alex Rivera",
      role: "Founder & CEO",
      bio: "Former founder with 10 years of experience in the startup ecosystem. Alex started Backchannel after experiencing the challenges of navigating VC relationships firsthand.",
      image: "/placeholders/team-1.jpg" // You'll need to add actual images to your public folder
    },
    {
      name: "Sarah Chen",
      role: "Head of Community",
      bio: "Previously led community at a major tech accelerator, Sarah is passionate about creating transparency in the founder-investor relationship.",
      image: "/placeholders/team-2.jpg"
    },
    {
      name: "Marcus Johnson",
      role: "CTO",
      bio: "Engineering leader with experience at both startups and major tech companies. Marcus built the secure infrastructure that protects reviewer anonymity.",
      image: "/placeholders/team-3.jpg"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">About Backchannel</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          We're building transparency in venture capital to help founders make more informed decisions.
        </p>
      </div>

      {/* Mission and Story */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Backchannel was founded with a simple mission: to bring transparency to venture capital. 
            We believe that founders deserve to know what they&apos;re getting into when they take on investment.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            By creating a platform where founders can anonymously share their experiences,
            we&apos;re leveling the playing field and helping the next generation of entrepreneurs
            make more informed decisions about who they partner with.
          </p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Backchannel was born out of personal experience. Our founder, Alex, raised venture capital
            for two previous startups and saw firsthand how the lack of transparency affected founders.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            After one particularly challenging investor relationship, Alex realized that if there had been
            a way to learn from other founders&apos; experiences, many headaches could have been avoided.
            Thus, Backchannel was created to fill that information gap.
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Transparency",
              description: "We believe information should flow freely in the startup ecosystem. By sharing experiences, we create a more informed and equitable environment for all."
            },
            {
              title: "Authenticity",
              description: "Every review on our platform is verified to ensure it comes from a real founder with real experience. We value truth over hype."
            },
            {
              title: "Constructive Feedback",
              description: "Our goal isn't to tear down VCs, but to provide constructive feedback that helps them improve and helps founders find the right partners."
            }
          ].map((value, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3">{value.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold mb-8 text-center">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm">
              <div className="h-64 relative bg-gray-200 dark:bg-gray-700">
                {/* Replace with actual images when available */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
                  <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{member.role}</p>
                <p className="text-gray-600 dark:text-gray-300">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-black dark:bg-white text-white dark:text-black rounded-lg p-10 text-center">
        <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
        <p className="text-xl mb-8 text-gray-300 dark:text-gray-700 max-w-2xl mx-auto">
          Help us build transparency in venture capital by sharing your experiences and empowering other founders.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/reviews/new" className="px-8 py-3 bg-white dark:bg-black text-black dark:text-white rounded-md font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            Write a Review
          </Link>
          <Link href="/contact" className="px-8 py-3 border border-white dark:border-black rounded-md font-medium hover:bg-white/10 dark:hover:bg-black/10 transition-colors">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}