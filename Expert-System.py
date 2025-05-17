# Add imports at the top of the file
from datetime import datetime


# Expert system for RA 10173 Sections 25–37, updated flow per attachments
# Categories: Personal/Sensitive Info, Breaching, Disclosure, Special Cases

# Define violation rules with fines and imprisonment
dictionary = {
    'Sec.25': {'desc': 'Unauthorized processing of personal data', 'fine': '₱500,000–₱1,000,000', 'imprisonment': '1–3 years'},
    'Sec.26': {'desc': 'Access due to negligence', 'fine': '₱100,000–₱500,000', 'imprisonment': '6 months–2 years'},
    'Sec.27': {'desc': 'Improper disposal of personal data', 'fine': '₱50,000–₱250,000', 'imprisonment': '6 months–1 year'},
    'Sec.28': {'desc': 'Processing for unauthorized purposes', 'fine': '₱200,000–₱500,000', 'imprisonment': '1–2 years'},
    'Sec.29': {'desc': 'Unauthorized access or breach', 'fine': '₱500,000–₱2,000,000', 'imprisonment': '1–4 years'},
    'Sec.30': {'desc': 'Concealment of security breaches', 'fine': '₱300,000–₱1,000,000', 'imprisonment': '6 months–3 years'},
    'Sec.31': {'desc': 'Malicious disclosure of personal data', 'fine': '₱500,000–₱2,000,000', 'imprisonment': '2–6 years'},
    'Sec.32': {'desc': 'Unauthorized disclosure of personal data', 'fine': '₱200,000–₱1,000,000', 'imprisonment': '1–3 years'},
    'Sec.33': {'desc': 'Combination or series of unauthorized acts', 'fine': '₱1,000,000–₱5,000,000', 'imprisonment': '2–8 years'},
    'Sec.34': {'desc': 'Liability of officers or agents', 'fine': '₱50,000–₱300,000', 'imprisonment': '6 months–2 years'},
    'Sec.35': {'desc': 'Large-scale offense', 'fine': '₱5,000,000–₱10,000,000', 'imprisonment': '4–8 years'},
    'Sec.36': {'desc': 'Offense by public officer', 'fine': '₱500,000–₱2,000,000', 'imprisonment': '2–6 years'}
}

# Category sequence and questions based on General-Questions.md
categories = [
    {
        'name': 'Personal/Sensitive Information',
        'general': 'Was any personal or sensitive personal information involved in the case? (yes/no): ',
        'general_questions': [
            'Was the data subject\'s consent obtained before processing? (yes/no): ',
            'Was it accessed without any form of authorization due to negligence? (yes/no): ',
            'Who processed the data (1-organization, 2-employee, 3-third party)?: ',
            'Was the processing authorized by law or the Data Privacy Act? (yes/no): '
        ],
        'sections': [
            ('Sec.25', 'Was the data processed without proper authorization or legal basis? (yes/no): '),
            ('Sec.26', 'Was it accessed without authorization due to negligence? (yes/no): '),
            ('Sec.27', 'Was any information improperly disposed of? (yes/no): '),
            ('Sec.28', 'Was the processing done for a purpose not authorized by the data subject? (yes/no): ')
        ],
        'follow_up': [
            'Did the processing involve sensitive personal information? (yes/no): ',
            'Is the violator a foreigner? (yes/no): '
        ]
    },
    {
        'name': 'Breaching',
        'general': 'Was there any unauthorized access to information or data breaching involved in this case? (yes/no): ',
        'general_questions': [
            'Was the breach reported to the National Privacy Commission (NPC)? (yes/no): '
        ],
        'sections': [
            ('Sec.29', 'Was there an intentional unauthorized access or breach? (yes/no): '),
            ('Sec.30', 'Was there a failure to notify NPC about the breach? (yes/no): ')
        ],
        'follow_up': [
            'Did the breach involve sensitive personal information? (yes/no): ',
            'Who was responsible (1-internal personnel, 2-third party, 3-external attacker)?: ',
            'Did the data breach affect multiple individuals? (yes/no): ',
            'If yes to previous question, how many individuals? (enter number): ',
            'Is the violator a foreigner? (yes/no): '
        ]
    },
    {
        'name': 'Disclosure of Information',
        'general': 'Was any personal or sensitive information disclosed to a third party? (yes/no): ',
        'general_questions': [
            'Was the disclosure authorized by the data subject or any law? (yes/no): ',
            'Was the disclosure done by a controller, processor, or employee? (yes/no): '
        ],
        'sections': [
            ('Sec.31', 'Was the disclosure made with malice or bad faith? (yes/no): '),
            ('Sec.32', 'Was the disclosure unauthorized? (yes/no): ')
        ],
        'follow_up': [
            'Was the information false or unwarranted? (yes/no): ',
            'Did the disclosure affect multiple individuals? (yes/no): ',
            'If yes to previous question, how many individuals? (enter number): ',
            'Is the violator a foreigner? (yes/no): ',
            'Was the disclosure part of a series of actions? (yes/no): '
        ]
    },
    {
        'name': 'Final Questions',
        'general': 'Additional case assessment questions: ',
        'sections': [
            ('Sec.33', 'Did the violator commit multiple violations? (yes/no): '),
            ('Sec.33', 'Was the disclosure part of a series of actions? (yes/no): '),
            ('Sec.34', 'Is an officer or agent liable? (yes/no): '),
            ('Sec.35', 'Does this case affect more than 1000 individuals? (yes/no): '),
            ('Sec.36', 'Is a public officer involved? (yes/no): ')
        ]
    }
]

if __name__ == '__main__':
    # Initialize variables
    user = input('Enter your name (e.g. John Doe): ')
    print(f"\nEvaluating possible violations for: {user}\n")

    detected = []
    follow_up_answers = {}
    is_large_scale = False
    has_sensitive_info = False
    has_multiple_violations = False
    total_affected_individuals = 0
    should_check_breach = False
    should_check_disclosure = False

    # Start with Personal/Sensitive Information (following flowchart)
    personal_info_cat = next(cat for cat in categories if cat['name'] == 'Personal/Sensitive Information')
    ans = input(personal_info_cat['general']).strip().lower()
    
    if ans == 'yes':
        # Process Personal/Sensitive Information
        if 'general_questions' in personal_info_cat:
            print(f"\nGeneral Questions for {personal_info_cat['name']}:")
            for q in personal_info_cat['general_questions']:
                ans = input(q).strip().lower()
                if 'negligence' in q.lower() and ans == 'yes':
                    should_check_breach = True
                if 'authorization' in q.lower() and ans == 'no':
                    should_check_breach = True

        # Process violation sections
        print(f"\nSpecific Violations for {personal_info_cat['name']}:")
        for sec, q in personal_info_cat['sections']:
            if input(q).strip().lower() == 'yes':
                detected.append(sec)
                if any(term in q.lower() for term in ['unauthorized', 'negligence', 'improper']):
                    should_check_breach = True

        # Process follow-up questions
        if detected and 'follow_up' in personal_info_cat:
            print(f"\nFollow-up questions for {personal_info_cat['name']}:")
            follow_up_answers[personal_info_cat['name']] = []
            for q in personal_info_cat['follow_up']:
                ans = input(q).strip().lower()
                follow_up_answers[personal_info_cat['name']].append(ans)
                if 'sensitive personal information' in q.lower() and ans == 'yes':
                    has_sensitive_info = True
                    should_check_breach = True

    # Check Breaching if indicated by previous answers or explicit confirmation
    breach_cat = next(cat for cat in categories if cat['name'] == 'Breaching')
    if should_check_breach or input(f"\n{breach_cat['general']}").strip().lower() == 'yes':
        if 'general_questions' in breach_cat:
            print(f"\nGeneral Questions for {breach_cat['name']}:")
            for q in breach_cat['general_questions']:
                ans = input(q).strip().lower()
                if ans == 'no':
                    should_check_disclosure = True

        print(f"\nSpecific Violations for {breach_cat['name']}:")
        for sec, q in breach_cat['sections']:
            if input(q).strip().lower() == 'yes':
                detected.append(sec)
                should_check_disclosure = True

        if detected and 'follow_up' in breach_cat:
            print(f"\nFollow-up questions for {breach_cat['name']}:")
            follow_up_answers[breach_cat['name']] = []
            for q in breach_cat['follow_up']:
                ans = input(q).strip().lower()
                follow_up_answers[breach_cat['name']].append(ans)
                if 'sensitive personal information' in q.lower() and ans == 'yes':
                    has_sensitive_info = True
                elif 'how many individuals' in q.lower():
                    if follow_up_answers[breach_cat['name']][-2].lower() == 'yes':
                        affected = int(ans)
                        total_affected_individuals = max(total_affected_individuals, affected)
                        if affected > 1000:
                            is_large_scale = True

    # Check Disclosure if indicated by previous answers or explicit confirmation
    disclosure_cat = next(cat for cat in categories if cat['name'] == 'Disclosure of Information')
    if should_check_disclosure or input(f"\n{disclosure_cat['general']}").strip().lower() == 'yes':
        if 'general_questions' in disclosure_cat:
            print(f"\nGeneral Questions for {disclosure_cat['name']}:")
            for q in disclosure_cat['general_questions']:
                ans = input(q).strip()

        print(f"\nSpecific Violations for {disclosure_cat['name']}:")
        for sec, q in disclosure_cat['sections']:
            if input(q).strip().lower() == 'yes':
                detected.append(sec)

        if detected and 'follow_up' in disclosure_cat:
            print(f"\nFollow-up questions for {disclosure_cat['name']}:")
            follow_up_answers[disclosure_cat['name']] = []
            for q in disclosure_cat['follow_up']:
                ans = input(q).strip().lower()
                follow_up_answers[disclosure_cat['name']].append(ans)
                if 'how many individuals' in q.lower():
                    if follow_up_answers[disclosure_cat['name']][-2].lower() == 'yes':
                        affected = int(ans)
                        total_affected_individuals = max(total_affected_individuals, affected)
                        if affected > 1000:
                            is_large_scale = True

    # Process final questions if violations were detected
    if detected:
        final_cat = next(cat for cat in categories if cat['name'] == 'Final Questions')
        print(f"\n{final_cat['general']}")
        for sec, q in final_cat['sections']:
            if input(q).strip().lower() == 'yes':
                if sec not in detected:
                    detected.append(sec)
                if sec == 'Sec.33':
                    has_multiple_violations = True
                elif sec == 'Sec.35':
                    is_large_scale = True

    # Apply flowchart logic for penalties
    if len(detected) > 1:
        has_multiple_violations = True
        if 'Sec.33' not in detected:
            detected.append('Sec.33')

    if is_large_scale and 'Sec.35' not in detected:
        detected.append('Sec.35')

    if has_sensitive_info:
        # Upgrade penalties for sensitive information
        for sec in detected[:]:
            if sec == 'Sec.32':
                detected.append('Sec.31')
            elif sec == 'Sec.26':
                detected.append('Sec.25')

    # Remove duplicates while preserving order
    detected = list(dict.fromkeys(detected))

    # Compile summary in court format
    # Determine severity based on flowchart paths
    severity_level = "Standard"
    if is_large_scale and has_sensitive_info:
        severity_level = "Critical"
    elif is_large_scale or has_sensitive_info:
        severity_level = "High"
    elif has_multiple_violations:
        severity_level = "Elevated"    # Enhanced report format
    print("\n======== LEGAL ASSESSMENT REPORT ========")
    print("\nCONFIDENTIAL\n")
    print("=" * 50)

    # Generate Statement of Facts
    violation_descriptions = [dictionary[sec]['desc'].lower() for sec in detected]
    if len(violation_descriptions) > 1:
        violations_text = ", ".join(violation_descriptions[:-1]) + ", and " + violation_descriptions[-1]
    else:
        violations_text = violation_descriptions[0]

    print("\nSTATEMENT OF FACTS:")
    print("=" * 50)
    print(f"\nOn {datetime.now().strftime('%B %d, %Y')}, the subject individual, {user}, was found to have")
    print(f"potentially committed violation(s) of Republic Act No. 10173 (Data Privacy Act of 2012).")
    print(f"The alleged violations involve {violations_text}.")
    if total_affected_individuals > 0:
        print(f"These actions affected {total_affected_individuals:,} individual(s).")
    print(f"The violations constitute potential breaches under Section(s) {', '.join(detected)} of")
    print("the aforementioned Act, warranting assessment under its penal provisions.\n")

    print("\nThis report is generated for legal assessment purposes only.")
    print("It does not constitute legal advice and should not be used as such.\n")
    print(f"Case Assessment Date: {datetime.now().strftime('%B %d, %Y')}")
    print(f"Subject Individual: {user}")
    print(f"Case Severity: {severity_level}\n")

    print("=" * 50)
    print("SUMMARY OF VIOLATIONS:")
    print("=" * 50)
    if total_affected_individuals > 0:
        formatted_count = "{:,}".format(total_affected_individuals)
        print(f"\nTotal Individuals Affected: {formatted_count}")
    
    print("\nIdentified Violations:")
    for sec in detected:
        info = dictionary[sec]
        print(f"\n• {sec}:")
        print(f"  - Violation: {info['desc']}")
        print(f"  - Fine Range: {info['fine']}")
        print(f"  - Imprisonment: {info['imprisonment']}")

    # Calculate cumulative penalties
    total_fine_min = 0
    total_fine_max = 0
    total_imprisonment_min = 0
    total_imprisonment_max = 0

    for sec in detected:
        info = dictionary[sec]
        fine_range = info['fine'].split('–')
        min_fine = int(fine_range[0].replace('₱', '').replace(',', '').strip())
        max_fine = int(fine_range[1].replace('₱', '').replace(',', '').strip())
        total_fine_min += min_fine
        total_fine_max += max_fine

        imprisonment_range = info['imprisonment'].split('–')
        min_years = float(imprisonment_range[0].split()[0])
        if 'months' in imprisonment_range[0]:
            min_years /= 12
        max_years = float(imprisonment_range[1].split()[0])
        total_imprisonment_min += min_years
        total_imprisonment_max += max_years

    print("\nCUMULATIVE PENALTIES:")
    print("=" * 50)
    print(f"\nFine Range: ₱{total_fine_min:,.2f} to ₱{total_fine_max:,.2f}")
    print(f"Imprisonment Range: {total_imprisonment_min:.1f} to {total_imprisonment_max:.1f} years")

    # Special notes based on severity
    print("\nSPECIAL CONSIDERATIONS:")
    print("=" * 50)
    if severity_level == "Critical":
        print("\n- This case requires immediate attention due to its critical nature")
        print("- Mandatory reporting to the National Privacy Commission is required")
        print("- Immediate containment and remediation measures must be implemented")
    elif severity_level == "High":
        print("\n- Priority handling is recommended due to the scale or sensitivity of the violation")
        print("- Early notification to relevant authorities should be considered")
    elif severity_level == "Elevated":
        print("\n- Multiple violations require coordinated remediation efforts")
        print("- Comprehensive compliance review is recommended")

    # IRR References Section
    print("\nIRR REFERENCES AND GUIDELINES:")
    print("=" * 50)
    for sec in detected:
        if sec == 'Sec.25':
            print("\n• Rule IV - Data Privacy Principles")
            print("  - Section 20: General principles for processing personal data")
            print("  - Section 21: Principles of transparency, legitimate purpose, and proportionality")
        elif sec == 'Sec.26':
            print("\n• Rule VI - Security of Personal Information")
            print("  - Section 28: Guidelines for technical security measures")
            print("  - Section 29: Guidelines for organizational security measures")
        elif sec in ['Sec.29', 'Sec.30']:
            print("\n• Rule VIII - Breach Notification")
            print("  - Section 38: Personal data breach management")
            print("  - Section 39: Procedure for personal data breach notification")
        elif sec in ['Sec.31', 'Sec.32']:
            print("\n• Rule IX - Outsourcing and Subcontracting Agreements")
            print("  - Section 43: Agreements for outsourcing of personal data processing")
            print("  - Section 44: Agreements for subcontracting of personal data processing")

    # Enhanced Compliance Recommendations
    print("\nCOMPLIANCE RECOMMENDATIONS:")
    print("=" * 50)
    print("\nImmediate Actions Required:")
    if has_sensitive_info:
        print("1. Conduct Data Privacy Impact Assessment (DPIA)")
        print("2. Review and update privacy notices and consent mechanisms")
        print("3. Implement enhanced security measures for sensitive data")
    if has_multiple_violations:
        print("4. Establish comprehensive data protection policies")
        print("5. Conduct internal audit of data processing activities")
    if is_large_scale:
        print("6. Appoint dedicated Data Protection Officer (DPO)")
        print("7. Implement automated data protection monitoring")

    # NPC Notification Requirements
    print("\nNPC NOTIFICATION REQUIREMENTS:")
    print("=" * 50)
    print("\nReporting Timeline:")
    if severity_level == "Critical":
        print("• Initial Report: Within 24 hours of discovery")
        print("• Detailed Report: Within 5 days of discovery")
    else:
        print("• Report within 72 hours of discovery")
    
    print("\nRequired Documentation:")
    print("1. Nature of the breach")
    print("2. Personal data possibly involved")
    print("3. Measures taken to address the breach")
    print("4. Contact details of the DPO")

    # International Data Transfer Guidelines
    if any(term in str(follow_up_answers) for term in ["foreigner", "third party"]):
        print("\nINTERNATIONAL DATA TRANSFER REQUIREMENTS:")
        print("=" * 50)
        print("\nCross-border Data Flow:")
        print("1. Ensure adequate level of protection")
        print("2. Implement binding corporate rules")
        print("3. Obtain explicit consent for international transfers")
        print("4. Document transfer mechanisms and safeguards")

    print("\n" + "=" * 50)
    print("END OF REPORT")
    print("=" * 50)
    print("\nDisclaimer: This report is for informational purposes only and does not constitute legal advice.")
    print("Consult with a qualified legal professional for specific legal guidance.")