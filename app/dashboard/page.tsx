'use client';

export default function GeneratorPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-800 mb-2">AI Content Generator</h1>
      <p className="text-gray-600 mb-8">Enter a topic and let our AI create amazing content for you.</p>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <form>
          <div className="mb-4">
            <label htmlFor="topic" className="block text-gray-700 font-semibold mb-2">
              Topic / Brief
            </label>
            <textarea
              id="topic"
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g., 'A tweet announcing our new eco-friendly water bottle'"
            ></textarea>
          </div>
          
          <div className="mb-4">
            <label htmlFor="platform" className="block text-gray-700 font-semibold mb-2">
              Platform
            </label>
            <select
              id="platform"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="twitter">Twitter / X</option>
              <option value="linkedin">LinkedIn</option>
              <option value="instagram">Instagram Caption</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Generate Content
          </button>
        </form>
      </div>

      {/* AI-generated result */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Result</h2>
        <div className="bg-white p-6 rounded-lg shadow-md min-h-[200px] border border-gray-200">
          <p className="text-gray-500">Your generated content will appear here...</p>
        </div>
      </div>
    </div>
  );
}