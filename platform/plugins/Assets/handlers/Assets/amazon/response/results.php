<?php

function Assets_amazon_response_results($params)
{
    $r = Q::take($_REQUEST, array(
        'input' => ''
    ));

    if (!$r['input']) {
        return false;
    } else {

        $geostream = Places_Location::userStream();
 
        $params['locale'] = $geostream->getAttribute('country');

        $rows = Assets_Amazon::select('*')
            ->where(array(
                'locale' => $params['locale'],
                'input' => $r['input']
            ))
            ->fetchDbRows();

        $search = Assets_Amazon::itemSearch(
        // $searchIndex, $keywords, $locale
            "All",
            $r['input'],
            $params['locale']
        );
    }

    if ($rows) {
        foreach ($rows as $key=>$val) {
            $result[$key] = $val->{'fields'};
        }
    } elseif ($search) {
        $result = $search;
    } else {
        return false;
    }

    return $result;
}