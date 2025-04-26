import HealthDropdown from "@/components/user/health-dropdown/HealthDropdown"

export default function Profile() {
    return (
        <section className="w-full px-2">
            {/* dropdown menu container */}
            <div className="bg-[var(--background-darker)] rounded-2xl">
                <HealthDropdown />
            </div>
        </section>
    )
}