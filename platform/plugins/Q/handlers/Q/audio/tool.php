<?php

/**
 * @module Q-tools
 */

/**
 * Implements Q/Audio tool
 * @class Q filter
 * @constructor
 * @param {array} [$options] Override various options for this tool
 * @return {string}
 */
function Q_audio_tool($options)
{
    Q_Response::setToolOptions($options);
    Q_Response::addStylesheet('plugins/Q/css/audio.css', '');

    return '';
}