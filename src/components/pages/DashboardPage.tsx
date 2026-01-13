import {
	BookOpen,
	GraduationCap,
	BarChart2,
	Clapperboard,
} from 'lucide-react'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/src/components/ui/card'

export function DashboardPage() {
	return (
		<div className="min-h-screen bg-background text-foreground">
			<main className="container mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold mb-6">Dashboard</h1>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Total Courses
							</CardTitle>
							<BookOpen className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">12</div>
							<p className="text-xs text-muted-foreground">
								+2 since last month
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Completed Lessons
							</CardTitle>
							<GraduationCap className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">234</div>
							<p className="text-xs text-muted-foreground">
								+32 since last week
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Average Score
							</CardTitle>
							<BarChart2 className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">88%</div>
							<p className="text-xs text-muted-foreground">
								Maintained average
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								New Content
							</CardTitle>
							<Clapperboard className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">5</div>
							<p className="text-xs text-muted-foreground">
								Added this month
							</p>
						</CardContent>
					</Card>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2">
						<Card>
							<CardHeader>
								<CardTitle>Recent Activity</CardTitle>
							</CardHeader>
							<CardContent>
								<ul className="space-y-4">
									<li className="flex items-center">
										<div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mr-4">
											<BookOpen className="h-5 w-5" />
										</div>
										<div>
												<p className="font-medium">
													Started &quot;Advanced React Patterns&quot;
												</p>
											<p className="text-sm text-muted-foreground">
												2 hours ago
											</p>
										</div>
									</li>
									<li className="flex items-center">
										<div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mr-4">
											<GraduationCap className="h-5 w-5" />
										</div>
										<div>
												<p className="font-medium">
													Completed &quot;JavaScript for Beginners&quot;
												</p>
											<p className="text-sm text-muted-foreground">
												1 day ago
											</p>
										</div>
									</li>
									<li className="flex items-center">
										<div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mr-4">
											<BookOpen className="h-5 w-5" />
										</div>
										<div>
												<p className="font-medium">
													Started &quot;CSS Grid and Flexbox&quot;
												</p>
											<p className="text-sm text-muted-foreground">
												3 days ago
											</p>
										</div>
									</li>
								</ul>
							</CardContent>
						</Card>
					</div>

					<div>
						<Card>
							<CardHeader>
								<CardTitle>Continue Learning</CardTitle>
							</CardHeader>
							<CardContent>
								<ul className="space-y-4">
									<li className="p-4 bg-muted rounded-lg">
										<p className="font-semibold">
											Advanced React Patterns
										</p>
										<p className="text-sm text-muted-foreground mb-2">
											Lesson 3 of 12
										</p>
										<div className="w-full bg-background rounded-full h-2.5">
											<div
												className="bg-primary h-2.5 rounded-full"
												style={{ width: '25%' }}
											></div>
										</div>
									</li>
									<li className="p-4 bg-muted rounded-lg">
										<p className="font-semibold">CSS Grid and Flexbox</p>
										<p className="text-sm text-muted-foreground mb-2">
											Lesson 8 of 10
										</p>
										<div className="w-full bg-background rounded-full h-2.5">
											<div
												className="bg-primary h-2.5 rounded-full"
												style={{ width: '80%' }}
											></div>
										</div>
									</li>
								</ul>
							</CardContent>
						</Card>
					</div>
				</div>
			</main>
		</div>
	)
}
