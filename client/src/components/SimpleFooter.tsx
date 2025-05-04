export default function SimpleFooter() {
    return (
        <div className="mt-6 mb-6 text-center text-sm">
            <p className="text-gray-600">
                © {new Date().getFullYear()} TechTrove. All rights reserved.
            </p>
        </div>
    )
}