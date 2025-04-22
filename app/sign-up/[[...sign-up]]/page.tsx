import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <div className="w-full max-w-md">
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-none border border-gray-200 dark:border-gray-800 rounded-lg",
              headerTitle: "text-xl font-medium",
              headerSubtitle: "text-sm text-gray-500 dark:text-gray-400",
              formButtonPrimary: "bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200",
              formFieldInput: "rounded-md border-gray-300 dark:border-gray-700 bg-transparent",
              footerActionLink: "text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300",
              identityPreviewEditButton: "text-black dark:text-white",
            },
          }}
        />
      </div>
    </div>
  );
}