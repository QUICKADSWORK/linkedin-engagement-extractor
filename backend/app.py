"""
LinkedIn Engagement Extractor - Backend API
Extracts engagement data (reactions and comments) from LinkedIn posts
"""

import os
import requests
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import csv
import io
from datetime import datetime
from urllib.parse import urlparse, quote
import re

app = Flask(__name__, static_folder='../frontend', static_url_path='')
CORS(app)


@app.route('/')
def serve_frontend():
    """Serve the frontend HTML"""
    return app.send_static_file('index.html')


@app.route('/roas')
def serve_roas_calculator():
    """Serve the ROAS calculator page"""
    return app.send_static_file('roas-calculator.html')

# RapidAPI Configuration
RAPIDAPI_HOST = "fresh-linkedin-profile-data.p.rapidapi.com"
RAPIDAPI_KEY = os.environ.get("RAPIDAPI_KEY", "56b6f4dce1mshc3398ebe2b7bdf7p1a8c18jsn91e4f7fa09ae")

HEADERS = {
    "x-rapidapi-host": RAPIDAPI_HOST,
    "x-rapidapi-key": RAPIDAPI_KEY
}


def validate_linkedin_post_url(url):
    """Validate if the URL is a valid LinkedIn post URL"""
    if not url:
        return False, "URL is required"
    
    patterns = [
        r'linkedin\.com/posts/',
        r'linkedin\.com/feed/update/',
        r'linkedin\.com/pulse/',
        r'linkedin\.com/embed/feed/update/'
    ]
    
    for pattern in patterns:
        if re.search(pattern, url):
            return True, "Valid LinkedIn post URL"
    
    return False, "Invalid LinkedIn post URL. Please provide a valid LinkedIn post or activity URL."


def extract_post_id(url):
    """Extract the post/activity ID from a LinkedIn URL"""
    # Try different patterns to extract the numeric activity ID
    patterns = [
        r'activity[:-](\d+)',                    # activity-1234567890 or activity:1234567890
        r'ugcPost[:-](\d+)',                     # ugcPost-1234567890
        r'update/urn:li:activity:(\d+)',         # /update/urn:li:activity:1234567890
        r'update/urn:li:ugcPost:(\d+)',          # /update/urn:li:ugcPost:1234567890
        r'-(\d{19,20})-',                        # -1234567890123456789- (19-20 digit IDs in URLs)
        r'-(\d{19,20})(?:\?|$)',                 # -1234567890123456789? or end of string
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    
    # If no ID found, return None
    return None


def get_post_reactions(post_url):
    """Fetch reactions for a LinkedIn post using RapidAPI"""
    # Extract the activity ID from the URL
    activity_id = extract_post_id(post_url)
    
    if not activity_id:
        print(f"Could not extract activity ID from URL: {post_url}")
        return None
    
    # The API requires just the numeric activity ID with the 'urn' parameter
    endpoint = f"https://{RAPIDAPI_HOST}/get-post-reactions?urn={activity_id}"
    
    try:
        print(f"Fetching reactions for activity ID: {activity_id}")
        response = requests.get(endpoint, headers=HEADERS, timeout=30)
        print(f"Reactions response status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Reactions response: {data.get('message', 'no message')}, total: {data.get('total', 0)}")
            if data and data.get('message') == 'ok':
                return data
            elif data and data.get('data'):
                return data
        else:
            print(f"Reactions API error: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"Request error: {e}")
    
    return None


def get_post_comments(post_url):
    """Fetch comments for a LinkedIn post using RapidAPI"""
    # Extract the activity ID from the URL
    activity_id = extract_post_id(post_url)
    
    if not activity_id:
        print(f"Could not extract activity ID from URL: {post_url}")
        return None
    
    # The API requires just the numeric activity ID with the 'urn' parameter
    endpoint = f"https://{RAPIDAPI_HOST}/get-post-comments?urn={activity_id}"
    
    try:
        print(f"Fetching comments for activity ID: {activity_id}")
        response = requests.get(endpoint, headers=HEADERS, timeout=30)
        print(f"Comments response status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Comments response: {data.get('message', 'no message')}")
            if data and data.get('message') == 'ok':
                return data
            elif data and data.get('data'):
                return data
        else:
            print(f"Comments API error: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"Request error: {e}")
    
    return None


def extract_profiles_from_reactions(reactions_data):
    """Extract unique profile URLs from reactions data"""
    profiles = []
    
    if not reactions_data:
        return profiles
    
    # Handle the actual API response structure: { "data": [...], "message": "ok", "total": N }
    data_list = reactions_data.get('data', []) if isinstance(reactions_data, dict) else reactions_data
    
    if not isinstance(data_list, list):
        data_list = [data_list] if data_list else []
    
    for item in data_list:
        profile = {}
        
        # The API returns: { "reactor": { "name", "headline", "linkedin_url", "urn" }, "type": "LIKE/PRAISE/etc" }
        reactor = item.get('reactor', {}) if isinstance(item.get('reactor'), dict) else {}
        
        # Get profile URL from reactor object or directly from item
        profile_url = (
            reactor.get('linkedin_url') or
            reactor.get('profile_url') or
            item.get('linkedin_url') or 
            item.get('profile_url') or 
            item.get('profileUrl')
        )
        
        if profile_url:
            # Ensure it's a full URL
            if not profile_url.startswith('http'):
                profile_url = f"https://www.linkedin.com/in/{profile_url}"
            
            profile['profile_url'] = profile_url
            profile['name'] = reactor.get('name') or item.get('name') or item.get('full_name') or ''
            profile['headline'] = reactor.get('headline') or item.get('headline') or item.get('title') or ''
            
            # Reaction type from item.type (e.g., LIKE, PRAISE, EMPATHY, etc.)
            reaction_type = item.get('type') or item.get('reaction_type') or item.get('reactionType') or 'LIKE'
            profile['reaction_type'] = reaction_type
            profile['engagement_type'] = 'reaction'
            profile['profile_picture'] = reactor.get('profile_picture') or item.get('profile_picture') or ''
            
            profiles.append(profile)
    
    return profiles


def extract_profiles_from_comments(comments_data):
    """Extract unique profile URLs from comments data"""
    profiles = []
    
    if not comments_data:
        return profiles
    
    data_list = comments_data if isinstance(comments_data, list) else comments_data.get('data', [])
    
    if not isinstance(data_list, list):
        data_list = [data_list] if data_list else []
    
    for item in data_list:
        profile = {}
        
        profile_url = (
            item.get('profile_url') or 
            item.get('linkedin_url') or 
            item.get('profileUrl') or
            item.get('commenter_profile_url') or
            item.get('author', {}).get('profile_url') if isinstance(item.get('author'), dict) else None
        )
        
        if profile_url:
            if not profile_url.startswith('http'):
                profile_url = f"https://www.linkedin.com/in/{profile_url}"
            
            profile['profile_url'] = profile_url
            profile['name'] = item.get('name') or item.get('commenter_name') or item.get('author_name') or ''
            profile['headline'] = item.get('headline') or item.get('commenter_headline') or ''
            profile['comment_text'] = item.get('comment') or item.get('text') or item.get('comment_text') or ''
            profile['engagement_type'] = 'comment'
            profile['profile_picture'] = item.get('profile_picture') or ''
            
            profiles.append(profile)
    
    return profiles


def deduplicate_profiles(profiles):
    """Remove duplicate profiles based on profile_url"""
    seen = set()
    unique_profiles = []
    
    for profile in profiles:
        url = profile.get('profile_url', '').lower().rstrip('/')
        if url and url not in seen:
            seen.add(url)
            unique_profiles.append(profile)
    
    return unique_profiles


def generate_demo_data(post_url):
    """Generate demo data for testing when API doesn't return data"""
    demo_profiles = [
        {
            'profile_url': 'https://www.linkedin.com/in/sarah-johnson-tech',
            'name': 'Sarah Johnson',
            'headline': 'Senior Product Manager at Google',
            'reaction_type': 'LIKE',
            'engagement_type': 'reaction',
            'profile_picture': ''
        },
        {
            'profile_url': 'https://www.linkedin.com/in/michael-chen-dev',
            'name': 'Michael Chen',
            'headline': 'Full Stack Developer | React | Node.js',
            'reaction_type': 'CELEBRATE',
            'engagement_type': 'reaction',
            'profile_picture': ''
        },
        {
            'profile_url': 'https://www.linkedin.com/in/emily-rodriguez-marketing',
            'name': 'Emily Rodriguez',
            'headline': 'Digital Marketing Strategist',
            'comment_text': 'Great insights! This really resonates with my experience.',
            'engagement_type': 'comment',
            'profile_picture': ''
        },
        {
            'profile_url': 'https://www.linkedin.com/in/david-kumar-startup',
            'name': 'David Kumar',
            'headline': 'Startup Founder | Y Combinator W23',
            'reaction_type': 'INSIGHTFUL',
            'engagement_type': 'reaction',
            'profile_picture': ''
        },
        {
            'profile_url': 'https://www.linkedin.com/in/lisa-wang-ux',
            'name': 'Lisa Wang',
            'headline': 'UX Designer at Meta',
            'comment_text': 'Thanks for sharing this perspective!',
            'engagement_type': 'comment',
            'profile_picture': ''
        },
        {
            'profile_url': 'https://www.linkedin.com/in/james-wilson-ai',
            'name': 'James Wilson',
            'headline': 'AI/ML Engineer | Ex-OpenAI',
            'reaction_type': 'LOVE',
            'engagement_type': 'reaction',
            'profile_picture': ''
        },
        {
            'profile_url': 'https://www.linkedin.com/in/anna-martinez-hr',
            'name': 'Anna Martinez',
            'headline': 'HR Director | People Operations',
            'reaction_type': 'SUPPORT',
            'engagement_type': 'reaction',
            'profile_picture': ''
        },
        {
            'profile_url': 'https://www.linkedin.com/in/robert-taylor-finance',
            'name': 'Robert Taylor',
            'headline': 'CFO at Fortune 500 Company',
            'comment_text': 'Excellent analysis. Would love to connect and discuss further.',
            'engagement_type': 'comment',
            'profile_picture': ''
        }
    ]
    
    return demo_profiles


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'service': 'LinkedIn Engagement Extractor'
    })


@app.route('/api/extract', methods=['POST'])
def extract_engagement():
    """Main endpoint to extract engagement data from a LinkedIn post"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'Request body is required'
            }), 400
        
        post_url = data.get('post_url', '').strip()
        
        # Validate URL
        is_valid, message = validate_linkedin_post_url(post_url)
        if not is_valid:
            return jsonify({
                'success': False,
                'error': message
            }), 400
        
        all_profiles = []
        reaction_count = 0
        comment_count = 0
        errors = []
        
        # Fetch reactions
        try:
            reactions_data = get_post_reactions(post_url)
            if reactions_data:
                reaction_profiles = extract_profiles_from_reactions(reactions_data)
                all_profiles.extend(reaction_profiles)
                reaction_count = len(reaction_profiles)
        except Exception as e:
            errors.append(f"Error fetching reactions: {str(e)}")
        
        # Fetch comments
        try:
            comments_data = get_post_comments(post_url)
            if comments_data:
                comment_profiles = extract_profiles_from_comments(comments_data)
                all_profiles.extend(comment_profiles)
                comment_count = len(comment_profiles)
        except Exception as e:
            errors.append(f"Error fetching comments: {str(e)}")
        
        # Deduplicate profiles
        unique_profiles = deduplicate_profiles(all_profiles)
        
        # If no data was fetched, optionally use demo data for demonstration
        if not unique_profiles:
            # Check if demo mode is enabled (default: False since user has subscription)
            demo_mode = os.environ.get('DEMO_MODE', 'False').lower() == 'true'
            
            if demo_mode:
                # Return demo data for demonstration purposes
                demo_profiles = generate_demo_data(post_url)
                demo_reactions = len([p for p in demo_profiles if p['engagement_type'] == 'reaction'])
                demo_comments = len([p for p in demo_profiles if p['engagement_type'] == 'comment'])
                
                return jsonify({
                    'success': True,
                    'data': {
                        'profiles': demo_profiles,
                        'total_count': len(demo_profiles),
                        'reaction_count': demo_reactions,
                        'comment_count': demo_comments,
                        'post_url': post_url
                    },
                    'message': 'Demo mode: Showing sample data. The actual API may not have data for this post.',
                    'demo_mode': True
                })
            else:
                # The API might not have data or the post might be private
                return jsonify({
                    'success': True,
                    'data': {
                        'profiles': [],
                        'total_count': 0,
                        'reaction_count': 0,
                        'comment_count': 0,
                        'post_url': post_url
                    },
                    'message': 'No engagement data found. The post may be private, have no engagement, or the API may not have access to this content.'
                })
        
        return jsonify({
            'success': True,
            'data': {
                'profiles': unique_profiles,
                'total_count': len(unique_profiles),
                'reaction_count': reaction_count,
                'comment_count': comment_count,
                'post_url': post_url
            },
            'errors': errors if errors else None
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'An unexpected error occurred: {str(e)}'
        }), 500


@app.route('/api/download/csv', methods=['POST'])
def download_csv():
    """Generate and download CSV file with profile data"""
    try:
        data = request.get_json()
        profiles = data.get('profiles', [])
        
        if not profiles:
            return jsonify({
                'success': False,
                'error': 'No profiles to export'
            }), 400
        
        # Create CSV in memory
        output = io.StringIO()
        
        # Define CSV columns
        fieldnames = ['Profile URL', 'Name', 'Headline', 'Engagement Type', 'Reaction Type', 'Comment']
        writer = csv.DictWriter(output, fieldnames=fieldnames)
        writer.writeheader()
        
        for profile in profiles:
            writer.writerow({
                'Profile URL': profile.get('profile_url', ''),
                'Name': profile.get('name', ''),
                'Headline': profile.get('headline', ''),
                'Engagement Type': profile.get('engagement_type', ''),
                'Reaction Type': profile.get('reaction_type', ''),
                'Comment': profile.get('comment_text', '')
            })
        
        # Prepare file for download
        output.seek(0)
        
        # Convert to bytes
        bytes_output = io.BytesIO()
        bytes_output.write(output.getvalue().encode('utf-8-sig'))  # BOM for Excel compatibility
        bytes_output.seek(0)
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f'linkedin_engagement_{timestamp}.csv'
        
        return send_file(
            bytes_output,
            mimetype='text/csv',
            as_attachment=True,
            download_name=filename
        )
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Error generating CSV: {str(e)}'
        }), 500


@app.route('/api/validate', methods=['POST'])
def validate_url():
    """Endpoint to validate a LinkedIn post URL"""
    try:
        data = request.get_json()
        post_url = data.get('post_url', '').strip()
        
        is_valid, message = validate_linkedin_post_url(post_url)
        
        return jsonify({
            'valid': is_valid,
            'message': message
        })
        
    except Exception as e:
        return jsonify({
            'valid': False,
            'message': f'Validation error: {str(e)}'
        }), 500


@app.route('/api/calculate-roas', methods=['POST'])
def calculate_roas():
    """Calculate ROAS and provide advanced insights"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'Request body is required'
            }), 400
        
        # Extract parameters
        ad_spend = float(data.get('ad_spend', 0))
        revenue = float(data.get('revenue', 0))
        profit_margin = float(data.get('profit_margin', 0))
        conversions = int(data.get('conversions', 0))
        industry = data.get('industry', 'general')
        currency = data.get('currency', 'USD')
        
        # Validate inputs
        if ad_spend <= 0:
            return jsonify({
                'success': False,
                'error': 'Ad spend must be greater than 0'
            }), 400
        
        # Calculate ROAS
        roas = revenue / ad_spend
        
        # Calculate additional metrics
        profit = None
        net_profit = None
        roi = None
        break_even_roas = 1.0
        
        if profit_margin > 0:
            profit = revenue * (profit_margin / 100)
            net_profit = profit - ad_spend
            roi = (net_profit / ad_spend) * 100
            break_even_roas = 100 / profit_margin
        
        cpa = None
        if conversions > 0:
            cpa = ad_spend / conversions
        
        # Calculate rating
        rating = get_roas_rating(roas)
        
        # Get industry benchmark
        industry_benchmarks = {
            'general': 4.0,
            'ecommerce': 4.5,
            'saas': 5.0,
            'finance': 3.5,
            'realestate': 5.5,
            'automotive': 3.0,
            'education': 4.0,
            'healthcare': 3.5,
            'travel': 4.0,
            'retail': 4.5,
            'b2b': 5.0
        }
        
        industry_benchmark = industry_benchmarks.get(industry, 4.0)
        
        # Generate insights
        insights = generate_roas_insights(roas, revenue, ad_spend, profit_margin, 
                                         break_even_roas, industry_benchmark)
        
        # Generate recommendations
        recommendations = generate_recommendations(roas, profit_margin, conversions)
        
        return jsonify({
            'success': True,
            'data': {
                'roas': round(roas, 2),
                'rating': rating,
                'metrics': {
                    'revenue': revenue,
                    'ad_spend': ad_spend,
                    'profit': round(profit, 2) if profit else None,
                    'net_profit': round(net_profit, 2) if net_profit else None,
                    'roi': round(roi, 2) if roi else None,
                    'cpa': round(cpa, 2) if cpa else None,
                    'break_even_roas': round(break_even_roas, 2),
                    'conversions': conversions
                },
                'benchmark': {
                    'industry': industry,
                    'industry_average': industry_benchmark,
                    'performance_vs_industry': round(((roas - industry_benchmark) / industry_benchmark) * 100, 1)
                },
                'insights': insights,
                'recommendations': recommendations,
                'currency': currency
            }
        })
        
    except ValueError as e:
        return jsonify({
            'success': False,
            'error': f'Invalid input values: {str(e)}'
        }), 400
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'An unexpected error occurred: {str(e)}'
        }), 500


def get_roas_rating(roas):
    """Determine the rating based on ROAS value"""
    if roas < 1:
        return {'level': 'Poor', 'color': 'danger', 'score': 1}
    elif roas < 2:
        return {'level': 'Fair', 'color': 'warning', 'score': 2}
    elif roas < 3:
        return {'level': 'Good', 'color': 'success', 'score': 3}
    elif roas < 4:
        return {'level': 'Great', 'color': 'success', 'score': 4}
    else:
        return {'level': 'Excellent', 'color': 'success', 'score': 5}


def generate_roas_insights(roas, revenue, ad_spend, profit_margin, break_even_roas, industry_benchmark):
    """Generate insights based on ROAS data"""
    insights = []
    
    # Performance insight
    if roas >= 4:
        insights.append({
            'type': 'success',
            'title': 'Excellent Performance',
            'message': f'Your ROAS of {roas:.2f} is outstanding! Your campaigns are highly profitable.'
        })
    elif roas >= 2:
        insights.append({
            'type': 'success',
            'title': 'Good Performance',
            'message': f'Your ROAS of {roas:.2f} is solid with room for optimization.'
        })
    elif roas >= 1:
        insights.append({
            'type': 'warning',
            'title': 'Break-Even Performance',
            'message': f'Your ROAS of {roas:.2f} means you\'re close to break-even. Optimization needed.'
        })
    else:
        insights.append({
            'type': 'danger',
            'title': 'Losing Money',
            'message': f'Your ROAS of {roas:.2f} indicates losses. Immediate action required.'
        })
    
    # Profitability insight
    if profit_margin > 0:
        if roas > break_even_roas:
            insights.append({
                'type': 'success',
                'title': 'Profitable After Costs',
                'message': f'Your ROAS exceeds break-even ({break_even_roas:.2f}). You\'re making profit.'
            })
        else:
            insights.append({
                'type': 'danger',
                'title': 'Not Yet Profitable',
                'message': f'Your ROAS is below break-even ({break_even_roas:.2f}). Not covering costs.'
            })
    
    # Industry comparison
    if roas > industry_benchmark:
        diff = ((roas - industry_benchmark) / industry_benchmark) * 100
        insights.append({
            'type': 'success',
            'title': 'Above Industry Average',
            'message': f'You\'re performing {diff:.1f}% above the industry benchmark.'
        })
    elif roas < industry_benchmark:
        diff = ((industry_benchmark - roas) / industry_benchmark) * 100
        insights.append({
            'type': 'warning',
            'title': 'Below Industry Average',
            'message': f'You\'re {diff:.1f}% below industry average. Room for improvement.'
        })
    
    # Scaling opportunity
    if roas >= 3 and roas < 10:
        insights.append({
            'type': 'info',
            'title': 'Scale Opportunity',
            'message': 'Strong ROAS suggests you can increase budget to capture more revenue.'
        })
    elif roas >= 10:
        insights.append({
            'type': 'info',
            'title': 'Untapped Potential',
            'message': 'Very high ROAS indicates possible under-spending. Consider scaling.'
        })
    
    return insights


def generate_recommendations(roas, profit_margin, conversions):
    """Generate actionable recommendations"""
    recommendations = []
    
    if roas < 2:
        recommendations.extend([
            'Review and refine your audience targeting',
            'A/B test new ad creatives and messaging',
            'Optimize your landing pages for better conversion',
            'Consider adjusting your bidding strategy'
        ])
    elif roas < 4:
        recommendations.extend([
            'Optimize your conversion funnel',
            'Test new audience segments',
            'Increase budget on top-performing campaigns'
        ])
    else:
        recommendations.extend([
            'Scale winning campaigns gradually (20-30% increases)',
            'Test lookalike audiences to expand reach',
            'Experiment with new ad formats or channels'
        ])
    
    # Always include monitoring
    recommendations.append('Set up automated ROAS monitoring and alerts')
    
    # Conditional recommendations
    if not profit_margin or profit_margin == 0:
        recommendations.append('Track profit margins to understand true profitability')
    
    if not conversions or conversions == 0:
        recommendations.append('Implement conversion tracking to calculate CPA')
    
    return recommendations


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    debug = os.environ.get('FLASK_DEBUG', 'True').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug)

